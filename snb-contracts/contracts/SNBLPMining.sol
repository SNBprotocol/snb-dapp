// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/* ========= 推荐奖励分发接口 ========= */
interface IRewardDistributor {
    function distributeReferralReward(address user, uint256 baseReward) external;
}

contract SNBLPMining is Ownable, ReentrancyGuard {

    IERC20 public immutable snb;      // SNB token
    IERC20 public immutable lpToken;  // SNB / WBNB LP token

    uint256 public rewardPerBlock;
    uint256 public lastRewardBlock;
    uint256 public accRewardPerShare; // multiplied by 1e12

    uint256 public totalStaked;
    uint256 public minStakeBlocks = 900;

    IRewardDistributor public rewardDistributor;

    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastStakeBlock;
    }

    mapping(address => UserInfo) public userInfo;

    /* ========= Zap 白名单 ========= */
    mapping(address => bool) public zapWhitelist;

    event Stake(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Claim(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);
    event RewardDistributorSet(address distributor);
    event ZapSet(address zap, bool allowed);

    constructor(
        address _snb,
        address _lpToken,
        uint256 _rewardPerBlock,
        uint256 _startBlock
    ) Ownable(msg.sender) {
        require(_snb != address(0), "SNB zero");
        require(_lpToken != address(0), "LP zero");

        snb = IERC20(_snb);
        lpToken = IERC20(_lpToken);
        rewardPerBlock = _rewardPerBlock;
        lastRewardBlock = _startBlock;
    }

    /* ================== VIEW ================== */

    function pendingReward(address user) external view returns (uint256) {
        UserInfo storage u = userInfo[user];
        uint256 _acc = accRewardPerShare;

        if (block.number > lastRewardBlock && totalStaked > 0) {
            uint256 blocks = block.number - lastRewardBlock;
            uint256 reward = blocks * rewardPerBlock;
            _acc += (reward * 1e12) / totalStaked;
        }

        return (u.amount * _acc) / 1e12 - u.rewardDebt;
    }

    /* ================== INTERNAL ================== */

    function updatePool() internal {
        if (block.number <= lastRewardBlock) return;

        if (totalStaked == 0) {
            lastRewardBlock = block.number;
            return;
        }

        uint256 blocks = block.number - lastRewardBlock;
        uint256 reward = blocks * rewardPerBlock;

        accRewardPerShare += (reward * 1e12) / totalStaked;
        lastRewardBlock = block.number;
    }

    function _safeDistributeReferral(address user, uint256 reward) internal {
        if (address(rewardDistributor) == address(0)) return;

        // ⭐ 核心升级点：推荐系统失败不影响主流程
        try rewardDistributor.distributeReferralReward(user, reward) {
            // ok
        } catch {
            // swallow error, do NOTHING
        }
    }

    /* ================== USER ================== */

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "zero");

        UserInfo storage u = userInfo[msg.sender];
        updatePool();

        _claim(msg.sender);

        lpToken.transferFrom(msg.sender, address(this), amount);
        u.amount += amount;
        totalStaked += amount;
        u.lastStakeBlock = block.number;

        u.rewardDebt = (u.amount * accRewardPerShare) / 1e12;
        emit Stake(msg.sender, amount);
    }

    function stakeFor(address user, uint256 amount) external nonReentrant {
        require(zapWhitelist[msg.sender], "not zap");
        require(amount > 0, "zero");

        UserInfo storage u = userInfo[user];
        updatePool();

        _claim(user);

        lpToken.transferFrom(msg.sender, address(this), amount);
        u.amount += amount;
        totalStaked += amount;
        u.lastStakeBlock = block.number;

        u.rewardDebt = (u.amount * accRewardPerShare) / 1e12;
    }

    function withdraw(uint256 amount) external nonReentrant {
        UserInfo storage u = userInfo[msg.sender];
        require(block.number >= u.lastStakeBlock + minStakeBlocks, "too early");
        require(u.amount >= amount, "insufficient");

        updatePool();

        _claim(msg.sender);

        if (amount > 0) {
            u.amount -= amount;
            totalStaked -= amount;
            lpToken.transfer(msg.sender, amount);
            emit Withdraw(msg.sender, amount);
        }

        u.rewardDebt = (u.amount * accRewardPerShare) / 1e12;
    }

    /// ✅ 纯领取（推荐）
    function claim() external nonReentrant {
        updatePool();
        _claim(msg.sender);
        userInfo[msg.sender].rewardDebt =
            (userInfo[msg.sender].amount * accRewardPerShare) / 1e12;
    }

    function _claim(address user) internal {
        UserInfo storage u = userInfo[user];
        if (u.amount == 0) return;

        uint256 pending =
            (u.amount * accRewardPerShare) / 1e12 - u.rewardDebt;

        if (pending > 0) {
            require(snb.transfer(user, pending), "SNB transfer failed");
            _safeDistributeReferral(user, pending);
            emit Claim(user, pending);
        }
    }

    function emergencyWithdraw() external nonReentrant {
        UserInfo storage u = userInfo[msg.sender];
        uint256 amount = u.amount;
        require(amount > 0, "nothing");

        u.amount = 0;
        u.rewardDebt = 0;
        totalStaked -= amount;

        lpToken.transfer(msg.sender, amount);
        emit EmergencyWithdraw(msg.sender, amount);
    }

    /* ================== ADMIN ================== */

    function setZap(address zap, bool allowed) external onlyOwner {
        zapWhitelist[zap] = allowed;
        emit ZapSet(zap, allowed);
    }

    function setRewardDistributor(address distributor) external onlyOwner {
        rewardDistributor = IRewardDistributor(distributor);
        emit RewardDistributorSet(distributor);
    }

    function setMinStakeBlocks(uint256 blocks_) external onlyOwner {
        minStakeBlocks = blocks_;
    }

    function setRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        updatePool();
        rewardPerBlock = _rewardPerBlock;
    }

    function rescueToken(address token, uint256 amount) external onlyOwner {
        require(token != address(lpToken), "cannot rescue LP");
        IERC20(token).transfer(msg.sender, amount);
    }
}
