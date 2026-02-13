// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IFeeDistributor {
    function distribute(address trader) external;
}

contract SNBTokenFinal is ERC20, Ownable {

    uint256 public constant TOTAL_SUPPLY = 100_000_000 * 1e18;

    uint256 public taxRate = 5; // 5%
    address public feeDistributor;

    // ================= 白名单 =================
    // Router / Zap / 系统合约
    mapping(address => bool) public isExcludedFromTax;

    // ✅ 新增：推荐奖励 / 系统奖励直通白名单
    mapping(address => bool) public isRewardDistributor;

    // ================= DEX Pair =================
    mapping(address => bool) public isDexPair;

    constructor(
        address _feeDistributor,
        address _owner
    ) ERC20("SNB", "SNB") Ownable(_owner) {
        feeDistributor = _feeDistributor;

        _mint(_owner, TOTAL_SUPPLY);

        // 默认免税
        isExcludedFromTax[_owner] = true;
        isExcludedFromTax[_feeDistributor] = true;
        isExcludedFromTax[address(this)] = true;
    }

    /* ================= Admin ================= */

    function setFeeDistributor(address _fd) external onlyOwner {
        feeDistributor = _fd;
        isExcludedFromTax[_fd] = true;
    }

    function setExcluded(address account, bool excluded) external onlyOwner {
        isExcludedFromTax[account] = excluded;
    }

    /// ✅ 新增：设置推荐奖励分发合约（RewardDistributor）
    function setRewardDistributor(address distributor, bool enabled)
        external
        onlyOwner
    {
        isRewardDistributor[distributor] = enabled;

        // 推荐奖励合约默认免税
        isExcludedFromTax[distributor] = enabled;
    }

    /// 设置 / 取消 DEX Pair（如 SNB/WBNB）
    function setDexPair(address pair, bool enabled) external onlyOwner {
        isDexPair[pair] = enabled;
    }

    /// 可调税率（≤10%）
    function setTaxRate(uint256 _rate) external onlyOwner {
        require(_rate <= 10, "tax too high");
        taxRate = _rate;
    }

    /* ================= Core ================= */

    /**
     * @dev OZ v5 hook
     * Called on EVERY balance update
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {

        // ================= ① mint / burn =================
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }

        // ================= ② 推荐奖励直通通道（🔥关键修复） =================
        // RewardDistributor → 用户
        if (isRewardDistributor[from]) {
            super._update(from, to, amount);
            return;
        }

        // ================= ③ 白名单不收税 =================
        if (isExcludedFromTax[from] || isExcludedFromTax[to]) {
            super._update(from, to, amount);
            return;
        }

        // ================= ④ DEX 买 / 卖判断 =================
        bool isBuy  = isDexPair[from];
        bool isSell = isDexPair[to];

        // 普通转账：不收税
        if (!isBuy && !isSell) {
            super._update(from, to, amount);
            return;
        }

        // ================= ⑤ DEX 交易：收税 =================
        uint256 tax = (amount * taxRate) / 100;
        uint256 sendAmount = amount - tax;

        // 扣税 → FeeDistributor
        if (tax > 0) {
            super._update(from, feeDistributor, tax);
        }

        // 正常转账
        super._update(from, to, sendAmount);

        // 仅在卖出时通知 FeeDistributor
        if (isSell && tax > 0) {
            IFeeDistributor(feeDistributor).distribute(from);
        }
    }
}
