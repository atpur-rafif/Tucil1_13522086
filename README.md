# Quickhacking Brute Force
This repository created to try every single possible combination in cyberpunk [quickhacking](https://cyberpunk.fandom.com/wiki/Quickhacking) (like) scenario, or in other word using brute force to find the most optimal way to get the highest score.  
  
Created by: Muhammad Atpur Rafif (13522086).

## Using Script
You can use file from release, or try to compile typescript file to javascript file yourself. There are two main script, both of them run at least using Node.js version 21.

1. Generator, (`node generator.js` to generate hacking scenario)
1. Quickhacking, (`node quickhacking.js` to find optimal solution)

## Compiling
1. Clone this repository
1. Install dependencies (`npm i`)
1. Compile program (`tsc`)
1. Move to bin directory, all script compiled there (`cd bin`)

## Multithreading
By default, this code use all of your CPU cores. It split the work using parameter named `divergePoint`, where that point deep in recursive call, the traversal continued by nodejs worker. To customize this behaviour, you can edit `index.ts`, then compile this code from source.
