// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IReferralRegistry {
    function getReferrer(address user) external view returns (address);
}

contract RewardDistributor is Ownable {

    IERC20 public immutable snb;
    IReferralRegistry public referralRegistry;

    address public feeDistributor;
    address public lpMining;

    // ================= 推荐比例（基于 baseReward） =================
    uint256 public level1Rate = 1000; // 10%
    uint256 public level2Rate = 500;  // 5%

    event ReferralReward(
        address indexed referrer,
        address indexed user,
        uint256 amount,
        uint8 level
    );

    modifier onlyDistributor() {
        require(
            msg.sender == feeDistributor || msg.sender == lpMining,
            "not authorized"
        );
        _;
    }

    constructor(
        address _snb,
        address _registry
    ) Ownable(msg.sender) {
        require(_snb != address(0), "SNB zero");
        require(_registry != address(0), "registry zero");

        snb = IERC20(_snb);
        referralRegistry = IReferralRegistry(_registry);
    }

    /* ================= Admin ================= */

    function setDistributors(
        address _feeDistributor,
        address _lpMining
    ) external onlyOwner {
        feeDistributor = _feeDistributor;
        lpMining = _lpMining;
    }

    function setReferralRates(
        uint256 _level1,
        uint256 _level2
    ) external onlyOwner {
        // 安全上限：总推荐比例 ≤ 20%
        require(_level1 + _level2 <= 2000, "rate too high");
        level1Rate = _level1;
        level2Rate = _level2;
    }

    /* ================= Core ================= */

    function distributeReferralReward(
        address user,
        uint256 baseReward
    ) external onlyDistributor {
        if (baseReward == 0) return;

        // 一级推荐人（B -> A，C -> B）
        address level1 = referralRegistry.getReferrer(user);
        if (level1 == address(0) || level1 == user) return;

        // 二级推荐人（C -> A）
        address level2 = referralRegistry.getReferrer(level1);

        // -------- 一级奖励 --------
        uint256 reward1 = (baseReward * level1Rate) / 10000;
        if (reward1 > 0) {
            require(
                snb.transfer(level1, reward1),
                "L1 transfer failed"
            );
            emit ReferralReward(level1, user, reward1, 1);
        }

        // -------- 二级奖励 --------
        if (
            level2 != address(0) &&
            level2 != user &&
            level2 != level1
        ) {
            uint256 reward2 = (baseReward * level2Rate) / 10000;
            if (reward2 > 0) {
                require(
                    snb.transfer(level2, reward2),
                    "L2 transfer failed"
                );
                emit ReferralReward(level2, user, reward2, 2);
            }
        }
    }
}
