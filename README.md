# Project: Distributed Social Networking
CMPUT 404 [Social Distribution Project](https://github.com/abramhindle/CMPUT404-project-socialdistribution)
## Team

- Marc-Andre Haley
- Haoyu Zhang
- Smit Patel
- Reham Albakouni
- 
# Description
I log into _SociallyDistributed_. I see my **stream** which is filled with **posts** that have arrived in my **inbox**. I browse them and I click **like** on anything by my **friend** Steph who is on another **node**.

When I click **like**, my node sends a like object to Steph’s inbox that **references** her post.

I then **comment** on Steph’s post. This sends a comment object to Steph’s inbox that references her post.

Steph’s node will process events at her inbox and **record** the comments and likes appropriately.

Then I write a **public post**, a **public service announcement** (**PSA**) about how public service announcements are pretentious performative social media and **you shouldn’t make them**. The irony is lost on me. I make an unlisted image post that contains an image for the PSA and reference it from my PSA post. Nonetheless my node records my post and makes a URL for both posts and then proceeds to send my public posts to the inboxes of everyone who **follows** me. My node knows who follows me and thus can just send the public post to each of those inboxes. Perhaps there will be a scaling problem in the future.

Later I write a **message** to Steph, a post that is **private** to just her. This post is sent to her inbox.

When Steph logs into her node she’ll see her stream and my public post will be on her stream. She should also see that I’ve liked and commented her post.
## License
MPL-2.0 license
