# Truth & Dare Prototype Plan (System-First)

## Why this doc exists
This project should be built with **system thinking first** (engine/flow), then features (UI/tools).

---

## 1) Product Goal (Prototype)
Build a **working offline Truth & Dare game** that users can open and play in under 10 seconds.

Success for V1 prototype:
- App opens fast
- User chooses a mode
- App generates question/challenge
- Group plays by speaking/acting in real life
- User taps next and keeps playing

No login. No backend. No cloud. No moderation pipeline.

---

## 2) System Design (Core Engine)

### A) Interaction Loop (primary system)
1. Choose mode (party/couple/family/solo)
2. Generate prompt (truth/challenge)
3. Human responds by voice/action
4. Next turn
5. Repeat

This is the minimum loop that creates engagement.

### B) Psychology Loop (retention system)
- **Uncertainty**: random prompt each turn
- **Social pressure**: group attention
- **Reward**: laughter/reaction/story value
- **Progress illusion**: “next turn” momentum

### C) Replay Loop (re-open behavior)
- Multiple modes
- Large prompt pool
- Mixed truth/challenge randomness
- Session restart with new combinations

---

## 3) Feature Scope (Only what serves system)

### Must-have (Prototype)
- Mode selector
- Random truth/challenge generator
- Prompt display card
- Next turn action
- Change mode action
- Local JSON content

### Should-have (After prototype works)
- Explicit “Truth” and “Challenge” buttons
- “Skip” with cooldown
- Round counter
- Lightweight haptics/sound

### Not now (avoid overload)
- Login/auth/OTP
- User-generated prompt uploads
- Backend/database
- Ads/monetization integrations
- Multiplayer sync

---

## 4) Content System
Keep prompts curated and safe by mode:
- party
- couple
- family
- solo

Rules:
- Short prompts (1–2 lines)
- Clear action language
- No harmful or illegal dares
- Family mode stays clean

---

## 5) Build Roadmap

### Phase 1 (Now: working model)
- Stabilize current screen flow
- Ensure mode reset behavior is clean
- Ensure no dead-ends in UI
- Verify random generation from each pool

### Phase 2 (Quality)
- Add simple session metrics (local only): turns played
- Add “Truth” / “Challenge” direct buttons
- Improve empty/loading states

### Phase 3 (Growth-ready)
- Add content packs (more prompts)
- Add local favorites/bookmarks
- Add “house rules” toggle set

---

## 6) Simple Money Model (later, not now)
Only after retention:
- Free core game
- Optional premium content packs (offline bundles)
- Event/party themed packs

No ads in prototype stage.

---

## 7) Weekly Execution System (anti-overwhelm)
Use this every week:
1. One tiny milestone
2. Build to completion
3. Test on real device
4. Ship
5. Reflect

Rule: **Finish small > plan huge.**

---

## 8) Definition of Done (Prototype)
Prototype is done when:
- A new user can play 5 turns without confusion
- No setup/login required
- App runs offline
- Mode changes are intuitive
- At least 20 prompts per mode are available (target)

---

## 9) Mindset Rule for this project
You are not trying to prove intelligence.
You are building the habit of completion.

**System before features. Completion before scale.**
