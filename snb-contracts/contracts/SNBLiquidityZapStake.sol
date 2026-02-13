// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// 自定义错误（精准定位问题）
error SNBZeroAddress();
error RouterZeroAddress();
error MiningZeroAddress();
error NoBNBInput();
error SwapFailed();
error NoSNBReceived();
error ApproveFailed();
error AddLiquidityFailed();
error LPPairNotFound();
error StakeApprovalFailed();
error BNBRefundFailed();

interface IPancakeRouter {
    function WETH() external pure returns (address);
    function factory() external view returns (address);
    
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
}

interface IPancakeFactory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface ISNBLPMining {
    function stakeFor(address user, uint256 amount) external;
}

contract SNBLiquidityZapStake is ReentrancyGuard {
    address public immutable snb;
    IPancakeRouter public immutable router;
    IPancakeFactory public immutable factory;
    ISNBLPMining public immutable mining;

    event ZapAndStake(address indexed user, uint256 bnbIn, uint256 lpStaked);

    constructor(
        address _snb,
        address _router,
        address _mining
    ) {
        if (_snb == address(0)) revert SNBZeroAddress();
        if (_router == address(0)) revert RouterZeroAddress();
        if (_mining == address(0)) revert MiningZeroAddress();

        snb = _snb;
        router = IPancakeRouter(_router);
        factory = IPancakeFactory(router.factory());
        mining = ISNBLPMining(_mining);
    }

    receive() external payable {}

    function zapAndStake(uint256 amountOutMin)
        external
        payable
        nonReentrant
    {
        if (msg.value == 0) revert NoBNBInput();
        // 拆分BNB（保留1 wei避免整除后丢失）
        uint256 half = (msg.value * 50) / 100;
        uint256 otherHalf = msg.value - half;

        // 1️⃣ 关键修复：记录兑换前的SNB余额（排除历史残留）
        uint256 preSwapSNB = IERC20(snb).balanceOf(address(this));
        
        // 兑换BNB -> SNB（路径：WBNB -> SNB）
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = snb;

        try router.swapExactETHForTokensSupportingFeeOnTransferTokens{ value: half }(
            amountOutMin,
            path,
            address(this),
            block.timestamp + 600 // 延长deadline到10分钟，避免超时
        ) {
            // 2️⃣ 计算本次兑换的实际到账SNB（核心修复：余额差）
            uint256 postSwapSNB = IERC20(snb).balanceOf(address(this));
            uint256 snbAmount = postSwapSNB - preSwapSNB;
            
            // 检查是否兑换到SNB（测试网流动性足够，至少>0）
            if (snbAmount == 0) revert NoSNBReceived();

            // 3️⃣ 授权Router划转SNB（先重置授权，避免授权额度问题）
            if (IERC20(snb).allowance(address(this), address(router)) > 0) {
                IERC20(snb).approve(address(router), 0);
            }
            bool approveSuccess = IERC20(snb).approve(address(router), type(uint256).max);
            if (!approveSuccess) revert ApproveFailed();

            // 4️⃣ 添加流动性（用实际到账的SNB数量）
            (, , uint256 liquidity) = router.addLiquidityETH{ value: otherHalf }(
                snb,
                snbAmount,
                (snbAmount * 90) / 100, // 10%滑点容忍（测试网必备）
                (otherHalf * 90) / 100,  // 10% ETH滑点容忍
                address(this),
                block.timestamp + 600
            );

            if (liquidity == 0) revert AddLiquidityFailed();

            // 5️⃣ 获取LP代币地址（确认交易对）
            address lp = factory.getPair(snb, router.WETH());
            if (lp == address(0)) revert LPPairNotFound();

            // 6️⃣ 授权质押LP（重置授权避免额度问题）
            if (IERC20(lp).allowance(address(this), address(mining)) > 0) {
                IERC20(lp).approve(address(mining), 0);
            }
            bool stakeApproveSuccess = IERC20(lp).approve(address(mining), liquidity);
            if (!stakeApproveSuccess) revert StakeApprovalFailed();
            
            // 7️⃣ 质押LP到挖矿合约
            mining.stakeFor(msg.sender, liquidity);

            // 8️⃣ 退还剩余资产（SNB + BNB）
            uint256 dustSNB = IERC20(snb).balanceOf(address(this));
            if (dustSNB > 0) {
                IERC20(snb).transfer(msg.sender, dustSNB);
            }

            uint256 dustBNB = address(this).balance;
            if (dustBNB > 0) {
                (bool ok,) = payable(msg.sender).call{ value: dustBNB }("");
                if (!ok) revert BNBRefundFailed();
            }

            emit ZapAndStake(msg.sender, msg.value, liquidity);
        } catch {
            // 捕获兑换异常（比如滑点、交易对问题）
            revert SwapFailed();
        }
    }

    // 辅助调试函数
    function checkLPPair() external view returns (address lp) {
        return factory.getPair(snb, router.WETH());
    }

    function getSNBBalance() external view returns (uint256) {
        return IERC20(snb).balanceOf(address(this));
    }

    // 测试兑换逻辑（只读，方便调试）
    function simulateSwap(uint256 /*bnbAmount*/) external view returns (address[] memory path) {
        path = new address[](2);
        path[0] = router.WETH();
        path[1] = snb;
        return path;
    }
}