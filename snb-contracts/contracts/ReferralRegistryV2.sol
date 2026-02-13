// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReferralRegistry {
    /* =========================
       Storage
    ========================= */

    // user => referrer
    mapping(address => address) private _referrerOf;

    // referrer => direct referrals
    mapping(address => address[]) private _directReferrals;

    // referrer => direct count（避免前端遍历数组）
    mapping(address => uint256) private _directCount;

    // user => 是否已产生过系统行为（防后绑）
    mapping(address => bool) private _activated;

    /* =========================
       Events
    ========================= */

    event ReferrerBound(
        address indexed user,
        address indexed referrer
    );

    event UserActivated(address indexed user);

    /* =========================
       Core
    ========================= */

    /**
     * @notice 绑定推荐人（一次性，不可更改）
     * @dev 只能在用户未激活前调用
     */
    function setReferrer(address referrer) external {
        require(referrer != address(0), "invalid referrer");
        require(referrer != msg.sender, "self referral");
        require(_referrerOf[msg.sender] == address(0), "already set");
        require(!_activated[msg.sender], "already activated");

        // 防止 A->B, B->A
        require(
            _referrerOf[referrer] != msg.sender,
            "circular referral"
        );

        _referrerOf[msg.sender] = referrer;
        _directReferrals[referrer].push(msg.sender);
        _directCount[referrer] += 1;

        emit ReferrerBound(msg.sender, referrer);
    }

    /**
     * @notice 标记用户已产生系统行为
     * @dev 由 Mining / Zap / FeeDistributor 调用
     */
    function activateUser(address user) external {
        if (!_activated[user]) {
            _activated[user] = true;
            emit UserActivated(user);
        }
    }

    /* =========================
       Views (Core)
    ========================= */

    function getReferrer(address user)
        external
        view
        returns (address)
    {
        return _referrerOf[user];
    }

    function getDirectReferrals(address referrer)
        external
        view
        returns (address[] memory)
    {
        return _directReferrals[referrer];
    }

    function getDirectCount(address referrer)
        external
        view
        returns (uint256)
    {
        return _directCount[referrer];
    }

    /* =========================
       Views (Helpers)
    ========================= */

    function hasReferrer(address user)
        external
        view
        returns (bool)
    {
        return _referrerOf[user] != address(0);
    }

    function isActivated(address user)
        external
        view
        returns (bool)
    {
        return _activated[user];
    }

    function getReferrerChain(address user)
        external
        view
        returns (address level1, address level2)
    {
        level1 = _referrerOf[user];
        if (level1 != address(0)) {
            level2 = _referrerOf[level1];
        }
    }
}
