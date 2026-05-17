# Social / X Agents

Build campaign rooms, proof-of-engagement flows, reply draft agents, bounty tollbooths, Space notes agents, and ambassador task workflows.

Human-approved. Receipt-gated. No fake engagement. No backend custody.

## What Is In The Pack

The Social/X Agent Pack is for legitimate creator and community workflows:

- campaign briefs
- reply drafts
- proof submissions
- human-reviewed bounties
- comment quality review
- campaign rooms
- thread drafts
- Space notes
- ambassador tasks
- engagement receipt trails

These are not spam tools.

## Hard Rules

- no fake engagement
- no bot swarms
- no auto-spam
- no auto-posting by default
- no fake accounts
- no harassment
- no impersonation
- no rate-limit evasion
- human approval required
- proof review required
- platform rules required

## Templates

- [X Campaign Brief Agent](../templates/agents/social-x/x-campaign-brief-agent.json)
- [X Reply Draft Agent](../templates/agents/social-x/x-reply-draft-agent.json)
- [X Proof Of Engagement Agent](../templates/agents/social-x/x-proof-of-engagement-agent.json)
- [X Bounty Tollbooth](../templates/agents/social-x/x-bounty-tollbooth.json)
- [X Comment Quality Reviewer](../templates/agents/social-x/x-comment-quality-reviewer.json)
- [X Campaign Room](../templates/agents/social-x/x-campaign-room.json)
- [X Thread Builder Agent](../templates/agents/social-x/x-thread-builder-agent.json)
- [X Spaces Notes Agent](../templates/agents/social-x/x-spaces-notes-agent.json)
- [X Ambassador Task Agent](../templates/agents/social-x/x-ambassador-task-agent.json)
- [X Engagement Receipt Agent](../templates/agents/social-x/x-engagement-receipt-agent.json)

## Prompt

```txt
Build an X Campaign Room agent using DNA x402.

It should:
- create a campaign brief
- define allowed actions and prohibited behavior
- accept proof URLs, hashes, and timestamps
- require human review
- issue a receipt only after proof acceptance
- never auto-post
- never spam
- never use fake accounts
```

## Mock/Devnet Acceptance

```bash
npm run examples:social-x
npm run acceptance:templates:devnet
```

The checks prove proof submissions require URL or hash plus timestamp, duplicate proofs are rejected, human review is required before receipt, and no template exposes auto-posting or fake engagement behavior.

