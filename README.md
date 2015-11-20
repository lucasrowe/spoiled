# <img src="spoiled-chrome-extension/icon.png" alt="egg-icon"/> Spoiled

A Chrome extension that blocks content using any provided keywords.
Stop spoilers, sports, or celebrity click-bait from ruining your interwebs.

## To Install
Clone this repository and then follow [Google's Instructions](https://developer.chrome.com/extensions/getstarted#unpacked). Make sure to load the folder called spoiled-chrome-extension.

A few more features need to get in this tool before I look into putting it on the Chrome store.

* [x] Better Twitter and Facebook coverage
* [x] Delete individual terms
* [x] Sync terms between browsers
* [x] Image blocking
* [x] Prettier blocked content
* [ ] Tooltip on Search Terms section
* [ ] Smarter insertion of search - Twitter takes way too long to trigger

## Source Code

### Dependency - Less

Less is used to simplify the CSS creation and has the added value of minifying
the stylesheet. The less stylesheet is not stored with the plugin, instead,

    assets/style.less

    compiles to spoiled-chrome-extension/style.css

To make changes to the style, make sure to edit the .less file.

## Roadmap

#### Planned Features
* [ ] Video blocking
* [ ] Counter of each word

See the issues list for wishlist and other enhancements.

## Contribute
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
