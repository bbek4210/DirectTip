DirectTip — Final Product Requirements Document (PRD)
1. Overview

DirectTip is a Next.js-based Web3 tipping platform that enables creators to receive real-time crypto donations (SOL/USDC) directly on their wallet, while displaying live donor alerts via stream overlays.

It combines:

Platform (registration + mapping)
YouTube UI injection (Donate button)
Real-time stream overlay alerts (OBS compatible)

Powered by Solana, DirectTip delivers instant, low-fee, non-custodial tipping.

2. Problem Statement

Creators today:

Lose significant revenue to platform fees
Lack crypto-native tipping tools
Use fragmented tools (YouTube + Streamlabs + external donations)

Viewers:

Cannot easily tip in crypto within the viewing experience
Lack visibility/recognition for donations
3. Solution

DirectTip provides:

Creator platform (register + wallet + channel)
Injected Donate button on YouTube
Non-custodial tipping (SOL/USDC)
Live overlay alerts (name + amount + message) for streams
4. User Roles
🎥 Creator
Registers on DirectTip
Adds:
YouTube channel
Solana wallet
Uses overlay in streaming software (OBS)
💸 Viewer (Fan)
Registers/logs in
Connects wallet
Sends tips + optional message
5. Core Features
5.1 User Authentication
Email / Google login
Role-based:
Creator
Viewer
5.2 Creator Dashboard
6

Features:

Add/edit wallet address
Link YouTube channel
Generate Overlay URL
View:
Total donations
Recent tips
Messages from donors
5.3 YouTube Donate Button Injection
6

Behavior:

Script detects YouTube page
Extracts channel ID
Fetches creator wallet from DirectTip API
Injects “Donate” button

States:

Not logged in → “Login to Donate”
Logged in → “Donate”
5.4 Tip Modal (Viewer Experience)

Features:

Enter amount:
SOL
USDC
Add custom message
Connect Phantom Wallet
Confirm transaction
5.5 Tip Transaction Flow
Viewer clicks Donate
Modal opens
Inputs:
Amount
Message
Wallet connection
Transaction signed
Sent directly to creator wallet
Transaction signature returned
5.6 Real-Time Tip Tracking
Status:
🟡 Pending
🟢 Confirmed
Uses Solana RPC confirmation
Explorer link via Solscan
5.7 Stream Overlay (KEY FEATURE)
7

Creators get a unique overlay URL:

https://directtip.app/overlay/{creatorId}

Used in:

OBS (Browser Source)
Streamlabs OBS
Any streaming tool
5.8 Overlay Features

Displays real-time donation alerts:

Fields:

Donor name / wallet (shortened)
Amount (SOL / USDC)
Message (from viewer)

Behavior:

Animated pop-up on new donation
Auto-hide after few seconds
Queue multiple donations
5.9 Donation Message System

Viewer can include:

Custom message (e.g., “Love your stream!”)

Displayed:

In overlay alert
In creator dashboard
5.10 Tip Feed (Dashboard + Overlay Sync)
Real-time updates via:
WebSockets (preferred)
or polling (MVP)
6. System Architecture
6.1 Frontend (Next.js)
Dashboard
Tip modal
Overlay UI (separate route)
Auth system
6.2 Injection Script
Lightweight JS snippet
Runs on YouTube pages
Injects Donate button
Calls DirectTip API
6.3 Backend (Next.js API / Node)

Endpoints:

/creator/:channelId → wallet lookup
/tips → store tip metadata
/overlay/:creatorId → live feed
/auth → users
6.4 Real-Time Layer
WebSocket / Pusher / Firebase
Push new donations to overlay instantly
6.5 Blockchain Layer
@solana/web3.js
@solana/spl-token
Direct wallet-to-wallet transfers
7. Data Model
Users
id
email
role
Creators
user_id
youtube_channel_id
wallet_address
Tips
id
sender_wallet
receiver_wallet
amount
token
message
tx_signature
status
8. User Flows
🎥 Creator Flow
Registers on DirectTip
Adds wallet + YouTube channel
Gets overlay URL
Adds overlay to OBS
Goes live
Sees real-time donation alerts
💸 Viewer Flow
Registers/logs in
Opens YouTube
Sees Donate button
Clicks Donate
Adds:
Amount
Message
Signs transaction
Donation appears on stream overlay
9. Non-Functional Requirements
Security
Fully non-custodial
No private key storage
Performance
Overlay latency < 1–2 sec
Lightweight injection
Reliability
Retry failed RPC calls
Handle network drops
10. Primary KPI
🎯 Core Metric

# of donations per live stream

Supporting Metrics
Avg donation size
% of viewers who donate
Overlay engagement (messages)
11. Milestones
Week 1–2
Auth + dashboard
Creator onboarding
Week 3
Wallet integration
SOL tipping
Week 4
YouTube injection
Donate button
Week 5
Overlay system (OBS)
Real-time alerts
Week 6
USDC support
Testing + deployment
12. Risks & Mitigation
Risk	Solution
YouTube DOM changes	Use MutationObserver
Wallet friction	UX onboarding
Spam messages	Rate limit / filters
Fake tips (unconfirmed tx)	Show only confirmed
13. Future Scope
On-screen animations/themes
NFT-based donor badges
Creator analytics (top supporters)
Multi-platform (Twitch, Kick)
Mobile support
🔥 Final Positioning

DirectTip = Streamlabs + SuperChat + Crypto — built on Solana