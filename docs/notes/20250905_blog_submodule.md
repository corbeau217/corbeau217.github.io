# 20250905_blog_submodule


## About
* notes regarding making the daily posts/blog a submodule/subrepo
---


## Notes
* having the submodule/subrepo
* they're all folders with `index.html` for structured posts
    - just replaces the inner portion of a post's card
* `.md` otherwise
    - converted to html code to add to the card
* having a folder for when there's images to add
* otherwise just standalone file
* using a `.sh` file to generate the list of file paths to start with
    - make it exist first then make it pretty
---


## Plans/Pathway
### Milestone 0 - init
- [ ] blog post repostory repo created
- [ ] planned out the milestones
### Milestone 1 - make it exist
- [ ] direct port of current structure with no changes to functionality
    - [ ] daily post files now separated to their own repository
    - [ ] stylesheet left in parent repo
- [ ] verify working
### Milestone 2 - baby steps
- [ ] analyse if current structure can have new post generation be automated
- [ ] determine next steps regarding `.md` and `.sh` files
- [ ] confirm if we can still use `XMLHttpRequest`
### Milestone 3 - automation
- [ ] `.md` support
- [ ] `.sh` to generate the list of posts
### Milestone 4 - "more"
- [ ] small number loaded from most recent, action is taken to request more
    - [ ] button to load X more
    - [ ] investigate infinite scrolling
---


## arguements for and against
---
### Pros and Cons
#### Pros
1. doesn't do a lot on its own but it debloats our main site repository from all the commit spam
2. reduces headache while making blog posts making them more accessible
3. creates a structure for us to use for other kinds of posts
4. opens up options for tagging posts, searching, and more complex post types
5. it's not so suffering to do as the unmedicated ADHD mind allows us to believe, very little work is needed to make it viable
    - separation of concerns does wonders for cognitive load
6. creates a precedent for future development structuring in that it can easily be adapted to other parts of the site
7. experience working with multiple projects
8. quality of life improvement to the code base
9. wanted to do it anyway
10. code tidy
11. deshackles the blog post/daily post structure abolishing the monolith
12. removes redundant code
13. centralises style and layout code allowing for simpler changes to the style of display
14. makes it more convenient to add notes about game ideas so that other people could use the large majority that get back-burner'ed for eternity
15. creates options for more post variety
16. filtering, tagging, sorting, grouping, indexing, searching, shuffling, referencing, and of course versioning.
    - can start creating a real system for which to browse and manage the posts
    - could even expand it out to be something really useful in other aspects
    - also means that if ever we move to sql or some cloud system, it doesnt take as much work to convert
#### Cons
1. excuse to avoid failure in current ideas
    - the lawnmower game really scratches a particular itch
2. simplest option is to not reinvent the wheel and return to astro
3. working with astro instead means that it's a format more people are working on
4. [competing standards xkcd comic](https://xkcd.com/927/)
5. easier to be scraped for AI models
6. even making this `.md` document is a variety of procrastination
---
### Rebuttals
#### Pro rebuttals
1. complexity demon screaches from a distance
2. is "makes me feel better" enough of a return from the sunk time in development
3. couldn't we just do it for other posts first or use an existing system to do those
4. why do we need the complexity when it's meant to be simple
5. but now we've gone and made this document which highlights just how grand the plans are for it so it really is that spooky
6. but our focus is on game design, not on web design, is this necessary?
7. can you call this experience? haven't we already done that before?
8. repeat of `2.`
9. "because we can" type comment
10. how much tidier vs. how much added complexity is a fine line
11. sounds a lot like we should be using astro instead
12. by adding more complexity
13. wouldnt half the fun be that the style changes over time and is reflected in the style of each post?
14. wouldn't this be exactly what we've been afraid of in the past?
15. this is a repeat of `3.`
16. that's a lot of words for complexity demon
#### Con rebuttals
1. but opens up options for planning our ideas
2. astro has the same problem that keeping it monolithic does, in that it adds bloat and headache
3. but it also makes our site less original
4. it doesnt need to be a full standard, we can even just not do half the suggestions for future development and it'd still be worthwhile
5. at this point that's a given so there's no need to worry about something we cant control (otherwise we'd have to make it entirely unaccessible and overly bloated)
6. making this `.md` is in a sense the planning and analysis stages of the software development cycle, including a distilled version of risk management

