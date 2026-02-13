// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IReferralRegistry {
    function distributeReferralReward(address trader, uint256 amount) external;
}

interface IPancakeRouter {
    function WETH() external pure returns (address);

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable;
}

contract SNBFeeDistributor is Ownable, ReentrancyGuard {

    IERC20 public immutable snb;
    IPancakeRouter public router;

    /* ===================== Destinations ===================== */

    address public lpMining;
    address public rewardPool;
    address public referralRegistry;

    address public buybackVault;
    address public liquidityVault;

    /* ===================== Tax Split (out of 100) ===================== */

    uint256 public lpShare         = 40;
    uint256 public buybackShare   = 20;
    uint256 public liquidityShare = 20;
    uint256 public rewardShare    = 20;

    /* ===================== Feature Switches ===================== */

    bool public enableBuyback = false;
    bool public enableLiquidityInjection = false;
    bool public enableReferral = true;

    /* ===================== Stats (NEW) ===================== */

    uint256 public totalDistributed;
    uint256 public totalDistributedToLP;
    uint256 public totalDistributedToReward;

    /* ===================== Constructor ===================== */

    constructor(
        address _snb,
        address _router,
        address _owner
    ) Ownable(_owner) {
        require(_snb != address(0), "SNB zero");
        require(_router != address(0), "router zero");

        snb = IERC20(_snb);
        router = IPancakeRouter(_router);
    }

    receive() external payable {}

    /* ===================== Admin Settings ===================== */

    function setDestinations(
        address _lpMining,
        address _rewardPool,
        address _buybackVault,
        address _liquidityVault,
        address _referralRegistry
    ) external onlyOwner {
        lpMining = _lpMining;
        rewardPool = _rewardPool;
        buybackVault = _buybackVault;
        liquidityVault = _liquidityVault;
        referralRegistry = _referralRegistry;
    }

    function setShares(
        uint256 _lp,
        uint256 _buyback,
        uint256 _liquidity,
        uint256 _reward
    ) external onlyOwner {
        require(
            _lp + _buyback + _liquidity + _reward == 100,
            "sum != 100"
        );
        lpShare = _lp;
        buybackShare = _buyback;
        liquidityShare = _liquidity;
        rewardShare = _reward;
    }

    function toggleFeatures(
        bool _buyback,
        bool _liquidity,
        bool _referral
    ) external onlyOwner {
        enableBuyback = _buyback;
        enableLiquidityInjection = _liquidity;
        enableReferral = _referral;
    }

    /* ===================== Core Distribution ===================== */

    function distribute(address trader) external nonReentrant {
        uint256 balance = snb.balanceOf(address(this));
        require(balance > 0, "no SNB");

        uint256 lpAmount =
            (balance * lpShare) / 100;
        uint256 buybackAmount =
            (balance * buybackShare) / 100;
        uint256 liquidityAmount =
            (balance * liquidityShare) / 100;
        uint256 rewardAmount =
            balance - lpAmount - buybackAmount - liquidityAmount;

        /* ===== Stats (NEW) ===== */
        totalDistributed += balance;
        totalDistributedToLP += lpAmount;
        totalDistributedToReward += rewardAmount;

        /* -------- LP Mining -------- */
        if (lpMining != address(0) && lpAmount > 0) {
            require(
                snb.transfer(lpMining, lpAmount),
                "LP transfer failed"
            );
        }

        /* -------- Reward Pool -------- */
        if (rewardPool != address(0) && rewardAmount > 0) {
            require(
                snb.transfer(rewardPool, rewardAmount),
                "Reward transfer failed"
            );
        }

        /* -------- Referral -------- */
        if (
            enableReferral &&
            referralRegistry != address(0) &&
            trader != address(0) &&
            rewardAmount > 0
        ) {
            IReferralRegistry(referralRegistry)
                .distributeReferralReward(trader, rewardAmount);
        }

        /* -------- Buyback -------- */
        if (
            enableBuyback &&
            buybackVault != address(0) &&
            buybackAmount > 0
        ) {
            require(
                snb.transfer(buybackVault, buybackAmount),
                "Buyback transfer failed"
            );
        }

        /* -------- Liquidity Injection -------- */
        if (
            enableLiquidityInjection &&
            liquidityVault != address(0) &&
            liquidityAmount > 0
        ) {
            require(
                snb.transfer(liquidityVault, liquidityAmount),
                "Liquidity transfer failed"
            );
        }
    }
}
