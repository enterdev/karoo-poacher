#Karoo Poacher
Karoo Poacher is a screenshot tool for Windows and OSX

Why another one? For fun, to try out a new tech, to be open-source, simple, modular and cross-platform.

#Usage
Start, the app

1. Windows:
 1. Press PrintScreen to take a screenshot
 2. Select the area you're interested in
 3. Arrow tool will be enabled, drag to draw arrows if needed
 4. Press Ctrl+C to copy image to clipboard
 5. Press Ctrl+D to upload image to cloud (imgur by default) and copy image the link clipboard
 6. Press Ctrl+R to clear and restart clipping and drawing
 7. Press Esc to cancel

2. OSX:
 1. Press Command+P to take a screenshot
 2. Select the area you're interested in
 3. Arrow tool will be enabled, drag to draw arrows if needed
 4. Press Command+C to copy image to clipboard
 5. Press Command+D to upload image to cloud (imgur by default) and copy image the link clipboard
 6. Press Command+R to clear and restart clipping and drawing
 7. Press Esc to cancel

#Nerd corner:
##TODO 
* take a look if asar can be still enabled, see app.asar.unpacked for desktop-screenshot
* show a more noticeable alert that you're screenshoting (screenshotting? screenshooting? whatever.)
* show selected area size
* enable tools menu
* Linux maybe? 

##rebuild on OSX
run npm rebuild --runtime=electron --target=1.4.10 --disturl=https://atom.io/download/atom-shell --abi=50
