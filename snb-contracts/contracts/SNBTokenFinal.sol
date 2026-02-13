// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IFeeDistributor {
    function distribute(address trader) external;
}

contract SNBTokenFinal is ERC20, Ownable {

    uint256 public constant TOTAL_SUPPLY = 100_000_000 * 1e18;

    // 🔒 税率写死 5%
    uint256 public constant taxRate = 5;

    // ================= Core Addresses =================

    address public feeDistributor;

    // 只能设置一次标记
    bool public feeDistributorInitialized;
    bool public dexPairInitialized;
    bool public rewardDistributorInitialized;
    bool public excludedInitialized;

    // ================= Whitelist =================

    mapping(address => bool) public isExcludedFromTax;

    // 推荐奖励直通
    mapping(address => bool) public isRewardDistributor;

    // DEX Pair（买卖判断）
    mapping(address => bool) public isDexPair;

    constructor(address _owner)
        ERC20("SNB", "SNB")
        Ownable(_owner)
    {
        _mint(_owner, TOTAL_SUPPLY);

        // 默认免税
        isExcludedFromTax[_owner] = true;
        isExcludedFromTax[address(this)] = true;
    }

    /* =====================================================
                        ONE-TIME CONFIG
    ===================================================== */

    function setFeeDistributor(address _fd) external onlyOwner {
        require(!feeDistributorInitialized, "FD already set");
        require(_fd != address(0), "zero");

        feeDistributor = _fd;
        isExcludedFromTax[_fd] = true;

        feeDistributorInitialized = true;
    }

    function setDexPair(address pair) external onlyOwner {
        require(!dexPairInitialized, "pair already set");
        require(pair != address(0), "zero");

        isDexPair[pair] = true;
        dexPairInitialized = true;
    }

    function setRewardDistributor(address distributor)
        external
        onlyOwner
    {
        require(!rewardDistributorInitialized, "reward already set");
        require(distributor != address(0), "zero");

        isRewardDistributor[distributor] = true;
        isExcludedFromTax[distributor] = true;

        rewardDistributorInitialized = true;
    }

    function setExcluded(address account)
        external
        onlyOwner
    {
        require(!excludedInitialized, "excluded locked");
        require(account != address(0), "zero");

        isExcludedFromTax[account] = true;
        excludedInitialized = true;
    }

    /* =====================================================
                            CORE LOGIC
    ===================================================== */

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {

        // mint / burn
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }

        // 推荐奖励直通
        if (isRewardDistributor[from]) {
            super._update(from, to, amount);
            return;
        }

        // 白名单免税
        if (isExcludedFromTax[from] || isExcludedFromTax[to]) {
            super._update(from, to, amount);
            return;
        }

        // DEX 买卖判断
        bool isBuy  = isDexPair[from];
        bool isSell = isDexPair[to];

        // 普通转账不收税
        if (!isBuy && !isSell) {
            super._update(from, to, amount);
            return;
        }

        // 交易收税
        uint256 tax = (amount * taxRate) / 100;
        uint256 sendAmount = amount - tax;

        if (tax > 0 && feeDistributor != address(0)) {
            super._update(from, feeDistributor, tax);
        }

        super._update(from, to, sendAmount);

        // 仅卖出触发分发
        if (isSell && tax > 0 && feeDistributor != address(0)) {
            IFeeDistributor(feeDistributor).distribute(from);
        }
    }
}
