# Userscript for Wordle

1. install TamperMonkey: https://www.tampermonkey.net/
2. install [wordle-solver.user.js](https://github.com/JJTimmons/wordle/raw/main/wordle-solver.user.js)
3. use guesses in header

<img width="825" alt="Screen Shot 2022-02-05 at 9 02 46 PM" src="https://user-images.githubusercontent.com/13923102/152665194-bafe5f34-6826-41aa-9fd8-2f5c40eef347.png">

It uses the letter frequencies of all remaining words to guess the next one.

Guess distribution over a 1k sample benchmark (# = 10):

```
2 | ####
3 | ################################
4 | #########################################
5 | ###############
6 | ####
7 | #
```
