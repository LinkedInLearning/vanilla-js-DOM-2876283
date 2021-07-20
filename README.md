# Vanilla JavaScript: Building on the Document Object Model (DOM)
This is the repository for the LinkedIn Learning course Vanilla JavaScript: Building on the Document Object Model (DOM). The full course is available from [LinkedIn Learning][lil-course-url].

![Vanilla JavaScript: Building on the Document Object Model (DOM)][lil-thumbnail-url] 

At the heart of every web application and framework (such as Angular or React) lies the DOM, the Document Object Model. In this course, instructor W. Scott Means explores the DOM from the bottom up. After a fast-paced introduction to the Node interface and DOM trees, Scott takes things to the next level by constructing a functioning HTML parser. He shows you how HTML source code is translated into a complete DOM tree, including comments, text nodes, and elements with attribute nodes. Then, Scott demonstrates how the resulting DOM tree can be traversed and transformed using DOM-specific maps and lists, tree references, and document fragments to produce pretty-printed HTML output. He concludes the course with advice on how you can practice what you’ve learned and get one step closer to mastering the DOM.

## Instructions
This repository has branches for each of the videos in the course. You can use the branch pop up menu in github to switch to a specific branch and take a look at the course at that stage, or you can add `/tree/BRANCH_NAME` to the URL to go to the branch you want to access.

## Branches
The branches are structured to correspond to the videos in the course. The naming convention is `CHAPTER#_MOVIE#`. As an example, the branch named `02_03` corresponds to the second chapter and the third video in that chapter. 
Some branches will have a beginning and an end state. These are marked with the letters `b` for "beginning" and `e` for "end". The `b` branch contains the code as it is at the beginning of the movie. The `e` branch contains the code as it is at the end of the movie. The `main` branch holds the final state of the code when in the course.

When switching from one exercise files branch to the next after making changes to the files, you may get a message like this:

    error: Your local changes to the following files would be overwritten by checkout:        [files]
    Please commit your changes or stash them before you switch branches.
    Aborting

To resolve this issue:
	
    Add changes to git using this command: git add .
	Commit changes using this command: git commit -m "some message"


### Instructor

W. Scott Means 
                            
Software Developer

                            

Check out my other courses on [LinkedIn Learning](https://www.linkedin.com/learning/instructors/w-scott-means).

[lil-course-url]: https://www.linkedin.com/learning/vanilla-javascript-building-on-the-document-object-model-dom
[lil-thumbnail-url]: https://cdn.lynda.com/course/2876283/2876283-1624636982594-16x9.jpg
