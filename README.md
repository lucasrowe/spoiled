# <img src="spoiled-chrome-extension/icon.png" alt="egg-icon"/> Spoiled

A Chrome extension that blocks content using any provided keywords.
Stop spoilers, sports, or celebrity click-bait from ruining your interwebs.

# To Install

This can be installed from the [Chrome Web Store](https://chrome.google.com/webstore/detail/spoiled/ofgoaiodajmkpocgdkjlokhhbpeodnci) just like any other plugin. To make changes to the source code of the plugin, follow the instructions below.

# Contribute
I'd love help from any other spoiler haters out there. This is my first Chrome extension and my javascript skills are in a constant state of staleness.

**Let's make this thing...**
* Fast
* Simple and usable
* Configurable
* Pretty

**Things we don't like about other extensions**
* Social logins
* User data collection
* Slow and heavy-handed

## Download Source Code

#### Instructions for beginning development
1. Download this repository.
2. Follow [Chrome's documentation](https://developer.chrome.com/extensions/getstarted) for getting started developing extensions.
3. Plugin content is inside the **_spoiled-chrome-extension_** folder. That's the folder that you should load from the **_chrome://extensions_** screen.
4. Style and branding content is in the **_assets_** folder -- [Less](http://lesscss.org/) is used for CSS pre-processing.

#### Dependency - Less

Less is used to simplify the CSS creation and has the added value of minifying
the stylesheet. The less stylesheet is not stored with the plugin, instead,

    assets/style.less

    compiles to spoiled-chrome-extension/style.css

To make changes to the style, make sure to edit the .less file.
    
## Test and Deploy

You can test by loading the unpacked extension in developer mode of chrome:://extensions (see Chrome's docs). Currently there are no automated tests.

To promote to production, just zip up the **spoiled-chrome-extension** directory and upload it to the Chrome developer dashboard.
    
    zip -r spoiled.zip ./spoiled-chrome-extension/*
