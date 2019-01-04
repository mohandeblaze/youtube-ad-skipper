var config = {
    overlay: {
        adContainer: 'ytp-ad-overlay-container',
        closeContainer: 'ytp-ad-overlay-close-container',
        closeButton: 'ytp-ad-overlay-close-button'
    },
    fullScreen: {
        adContainer: 'ytp-ad-player-overlay',
        closeContainer: 'ytp-ad-skip-button-container',
        closeButton: 'ytp-ad-skip-button ytp-button'
    },
    quality: {
        settingsButton: 'ytp-button ytp-settings-button',
        popupContainer: 'ytp-panel-menu',
        popupItems: 'ytp-menuitem',
        popupItemLabel: 'ytp-menuitem-label',
        popupItemValue: 'Quality',
        selectedItem: 'html5-video-container',
        selected: 'ytb-quality-selected'
    }
};
var done = false;

// TODO add class on root element and check

// TODO try window location
var selectItem = getElement(config.quality.selectedItem).children[0];
var selectItemSrc = selectItem.getAttribute('src').toString();
var first = true;

// Ad listener
function listenForAds() {
    if (nullCheck(getElement(config.overlay.adContainer))) {
        console.log('Found overlay Ad. Auto closing it.');
        overlayAdSkipper();
    };

    if (nullCheck(getElement(config.fullScreen.adContainer))) {
        console.log('Found fullscreen Ad. Auto closing it.');
        fullScreenAdSkipper();
    };
}

// TODO short this function somehow
function setHighestQuality() {
    if (first) {
        var settingsButton = getElement(config.quality.settingsButton);
        if (!settingsButton.classList.contains(config.quality.selected)) {
            console.log('Trying to set quality');
            if (nullCheck(settingsButton)) {
                fireEvent(settingsButton);
                setTimeout(function () {
                    selectTheItem('label');
                    setTimeout(function () {
                        selectTheItem('quality');
                    }, 500);
                }, 500);
            }
        }
        first = false;
    } else if (selectItem.getAttribute('src').toString() !== selectItemSrc) {
        var settingsButton = getElement(config.quality.settingsButton);
        if (!settingsButton.classList.contains(config.quality.selected)) {
            console.log('Trying to set quality');
            if (nullCheck(settingsButton)) {
                fireEvent(settingsButton);
                setTimeout(function () {
                    selectTheItem('label');
                    setTimeout(function () {
                        selectTheItem('quality');
                    }, 500);
                }, 500);
            }
        }
        first = false;
    }
}

function selectTheItem(type) {
    var label, popupContainer = getElement(config.quality.popupContainer);;
    if (nullCheck(popupContainer)) {
        var children = popupContainer.querySelectorAll(`.${config.quality.popupItems}`);
        if (type === 'label') {
            children.forEach(function (item) {
                label = (item.children[0].textContent === config.quality.popupItemValue) ? item : null;
            });
        } else if (type === 'quality') {
            for (let i = 0; i < children.length; i++) {
                var quality = children[i].children[0].querySelector('span');
                if ((nullCheck(quality) && quality.textContent.includes('1080'))) {
                    label = children[i];
                    break;
                }
                if (i === children.length - 1) {
                    label = children[0];
                }
            }
        }
        if (nullCheck(label)) {
            fireEvent(label);
            done = type === 'quality' ? true : false;
            selectItemSrc = selectItem.getAttribute('src').toString();
        }
    }
}

function overlayAdSkipper() {
    skipAds(getElement(config.overlay.closeButton), getElement(config.overlay.closeContainer));
}

function fullScreenAdSkipper() {
    skipAds(getElement(config.fullScreen.closeButton), getElement(config.fullScreen.closeContainer));
}

function skipAds(closeContainer, closeButton) {
    if (nullCheck(closeContainer) && nullCheck(closeButton)) {
        fireEvent(closeButton, 'click')
    };
}

function nullCheck(e) {
    return typeof (e) !== 'undefined' && e !== null;
}

function getElement(className) {
    return document.getElementsByClassName(className)[0];
}

function fireEvent(node) {
    if (node.dispatchEvent) {
        var event = node.ownerDocument.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        event.synthetic = true;
        node.dispatchEvent(event, true);
    }
};

console.log('Ad auto close initialized');
setInterval(listenForAds, 1000);

setInterval(setHighestQuality, 4000);
