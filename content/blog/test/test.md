---
title: 'How I Created my Dark/Light Mode Toggle using TypeScript and Web Components'
slug: simple-ecom-darkmode
description: There are a lot of ways one can probably implement a dark mode toggle for their site, and today I want to talk to you about two ways I had achieved this. The first way is actually quite a mess to deal with, but it is what I experienced when making my project the first time. The second way is done in my remake, and I feel as though it is much more elegant and readable than my first approach.
pubDate: 2026-04-13
category: Web Development
tags: ['typescript', 'javascript', 'project', 'web components']
---

## Introduction

There are a lot of ways one can probably implement a dark mode toggle for their site, and today I want to talk to you about two ways I had achieved this. The first way is actually quite a mess to deal with, but it is what I experienced when making my project the first time. The second way is done in my remake, and I feel as though it is much more elegant and readable than my first approach.

You may also be wondering if you read that correctly, and thinking to yourself "What? You started the project over, again!?" To that I say, yes. I did, in fact, start it again. This time made using Vite and TypeScript. I chose to do this because, as much as I had learned the first time, there were still many, many mistakes made that made it quite difficult to manage.

I had also previously made plans to discuss my entire project in one big blog post, however that became too much for me as there was _a lot_ to go over. It became a bit too cumbersome for me to try and cover everything thoroughly, so instead I am opting for a more bite-sized portion of my project.

## The Old Toggle

Among the larger mistakes is the way I handled my dark mode toggle. At the time, I was quite proud of my approach, however I now see it as very difficult to read and somewhat nonsensical.

The first major issue is that I had put practically all my menu logic into one large file called `menus.js` (large is relative, it is only 300 lines, but it still seemed too large for me and only would have grown larger). I thought I was clever when I first made it, because initially it just handled the opening and closing of the cart menu and the mobile navigation. Once I started working with web components, themes, scrolling effects, and having to do checks for specific browsers to handle certain things, it really got out of hand.

The way it worked with web components was particularly bad, because when you go into the web components themselves they actually have zero logic in them handling how and when they appear. In the `menus.js` script, I also had to do some funky stuff to get my web components selected, because for some reason if I wanted to do this: `cartMenu = storeCartMenu.shadowRoot.querySelector('.cart-menu');` I had to do it in its own function, then add an event listener to the DOM so that when the content loaded it would call this function.

To get an idea of how confusing this really can be, I will show you a snippet of my `themeToggle.js` component (after the HTML and CSS template):

```js
class themeToggle extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const clone = tpl_themeToggle.content.cloneNode(true);
    shadow.append(clone);
  }

  connectedCallback() {}
}

window.customElements.define('theme-toggle', themeToggle);
```

Yup, that is literally all of it. There is nothing in here doing anything besides just setting up the component to exist. It's really terrible in my opinion. There aren't even any imports or anything added here, so you wouldn't even guess that the `menus.js` file is the actual manager of the theme switching, and this simply serves as the UI element to activate it. The only way to know is to view the `menus.js` file and examine it.

Once you get into that menu file, you are gonna have a bad time because it is handling _nearly every single UI behavior_ in this one file. Very bad of me, I know, which is part of why I decided to rework my project.

Here is the snippet that shows how the theme system works in my `menus.js`:

```js
const themeToggle = document.querySelector('theme-toggle');
const themeLabel = document.querySelector('.theme-toggle-label');

let themeToggleSwitch = undefined;
let themeIconDark = undefined;
let themeIconLight = undefined;

function setThemeLocalStorage(theme) {
  localStorage.setItem('theme', theme);
}

function setColorTheme(theme) {
  switch (theme) {
    case 'dark':
      themeToggleSwitch.checked = false;
      themeIconDark.classList.add('active-theme');
      themeIconLight.classList.remove('active-theme');
      document.documentElement.setAttribute('data-theme', 'dark');
      themeLabel.textContent = 'Dark';
      break;
    case 'light':
      themeToggleSwitch.checked = true;
      themeIconDark.classList.remove('active-theme');
      themeIconLight.classList.add('active-theme');
      document.documentElement.setAttribute('data-theme', 'light');
      themeLabel.textContent = 'Light';

      break;
    default:
      themeToggleSwitch.checked = true;
      themeIconDark.classList.remove('active-theme');
      themeIconLight.classList.add('active-theme');
      document.documentElement.setAttribute('data-theme', 'light');
      themeLabel.textContent = 'Light';

      break;
  }
  setThemeLocalStorage(theme);
}

function getColorThemePreference() {
  if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark').matches) return 'dark';
    else return 'light';
  } else return 'light';
}

function handleThemeMenu() {
  if (document.documentElement.getAttribute('data-theme') == 'dark') {
    setColorTheme('light');
  } else if (document.documentElement.getAttribute('data-theme') == 'light') {
    setColorTheme('dark');
  }
}

function updateTheme() {
  if (localStorage.getItem('theme'))
    setColorTheme(localStorage.getItem('theme'));
  else setColorTheme(getColorThemePreference());
}

function initThemeMenu() {
  themeToggleSwitch = themeToggle.shadowRoot.getElementById('theme-switch');

  themeIconDark = themeToggle.shadowRoot.querySelector(
    '.theme-toggle-icon-dark',
  );
  themeIconLight = themeToggle.shadowRoot.querySelector(
    '.theme-toggle-icon-light',
  );

  themeToggleSwitch.addEventListener('click', handleThemeMenu);

  updateTheme();
}
```

There are also lots of other nitpicks to make here too. For instance, the `if` statement in my `getColorThemePreference()` method is kind of funky, and there is a better way to write it so I wouldn't need to have two return statements that return the same thing.

The `switch` in my `setColorTheme` would probably be fine if I had more themes than just light or dark, but it really isn't necessary here. On top of that, I believe there is a more elegant way of handling all of this anyway.

And, of course, just declaring a bunch of variables as `undefined` and then later assigning them in another function seemed weird to me as well.

Overall, I just really was not happy with this after seeing it recently, and I am a lot happier with my new solution.

## The New Toggle

Let's start with how I setup my web component for the new toggle, which in the very first line you see this:

```js
import {
  userPreferredLightMode,
  updateLightMode,
  isDarkMode,
  currentTheme,
} from '../utils/themeManager';
```

I like this because everything theme related is already separated into a clearly named script that manages anything theme related. If I need to update anything, I know where to go now after taking a look at my component.

Here is the snippet for the rest of the logic:

### Top of the File

```js
import {
  userPreferredLightMode,
  updateLightMode,
  isDarkMode,
  currentTheme,
} from '../utils/themeManager';

class LightModeToggleIcon {
  private _icon: string;

  constructor(isDarkMode: boolean) {
    this._icon = isDarkMode ? 'moon' : 'sun';
  }

  get icon(): string {
    return this._icon;
  }

  set icon(isDarkMode: boolean) {
    this._icon = isDarkMode ? 'moon' : 'sun';
  }
}

let toggleIcon = new LightModeToggleIcon(isDarkMode.enabled);

const TPL_LightModeToggle = document.createElement('template');
```

### HTML and CSS Setup

```js
const TPL_LightModeToggle_css = /* CSS */ `
<style>
  :host {
    --toggle-width: 3.25rem;
    --toggle-height: 1.75rem;

    --slider-size: 1.5rem;
    --slider-offset-left: 0.16rem;
    --slider-offset-bottom: calc((var(--toggle-height) * 0.5) - (var(--slider-size) * 0.5));
    --slider-translate: calc(var(--toggle-width) - (var(--slider-size) + (var(--slider-offset-left) * 2)));

    --icon-size: calc(var(--slider-size) * 0.9);
    --icon-offset: calc(var(--slider-offset-left) + 0.07rem);

    --transition: 200ms ease;
  }

  .toggle {
    position: relative;
    display: inline-block;
    width: var(--toggle-width);
    height: var(--toggle-height);

  }
  
  .toggle input { 
    opacity: 0;
    width: 0;
    height: 0;

  }
  
  .slider {
    display: flex;
    align-items: center;

    position: absolute;

    cursor: pointer;

    inset: 0;

    background-color: var(--color-surface-600);
    outline: 2px solid var(--color-surface-700);
    border-radius: var(--theme-rounded-base);

    transition: var(--transition);
  }

  .slider:hover, .toggle input:focus + .slider {
    outline: 2px solid var(--color-primary-500);
    
  }
  

  .icon {
    position: absolute;
    left: var(--icon-offset);

    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--icon-size);
    width: var(--icon-size);

    z-index: 10;

    transition: var(--transition);
  }

  .icon-disabled {
    display: none;
  }

  input:checked + .slider .icon {
    transform: translateX(var(--slider-translate));
  }

  box-icon {
    width: 100%;
    height: 100%;
  }
  
  .slider:before {
    position: absolute;

    content: "";

    height: var(--slider-size);
    width: var(--slider-size);
    
    left: var(--slider-offset-left);
    bottom: var(--slider-offset-bottom);

    background-color: var(--theme-font-color-base);
    border-radius: var(--theme-rounded-base);

    transition: var(--transition);
  }
  
  input:checked + .slider:before {
    transform: translateX(var(--slider-translate));
  }

  .themeToggleContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
  }



</style>
`;

TPL_LightModeToggle.innerHTML = /* HTML */ `
  ${TPL_LightModeToggle_css}

  <div class="themeToggleContainer">
    <label class="toggle">
      <input type="checkbox" id="themeToggle" />
      <span class="slider">
        <div class="icon">
          <box-icon type="solid" name="" color=""> </box-icon>
        </div>
      </span>
    </label>
    <span class="themeToggleLabel">Light</span>
  </div>
`;
```

### The Rest of the Component

```js
class LightModeToggle extends HTMLElement {
  private _lightModeToggle: HTMLInputElement;
  private _lightModeToggleLabel: HTMLElement;
  private _lightModeToggleIcon: HTMLElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const clone = TPL_LightModeToggle.content.cloneNode(true);
    shadow.append(clone);

    this._lightModeToggle = this.shadowRoot?.querySelector('#themeToggle')!;

    this._lightModeToggleLabel =
      this.shadowRoot?.querySelector('.themeToggleLabel')!;

    this._lightModeToggleIcon = this.shadowRoot?.querySelector('box-icon')!;
  }

  connectedCallback() {
    this._lightModeToggle!.addEventListener(
      'change',
      this.toggleLightMode.bind(this)
    );
    this._lightModeToggle!.checked = userPreferredLightMode();
    this.updateToggleLabel(this._lightModeToggleLabel!);
    this.updateToggleIcon();
  }

  toggleLightMode(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    isDarkMode.enabled = checkbox.checked;

    updateLightMode();

    this.updateToggleLabel(this._lightModeToggleLabel!);
    this.updateToggleIcon();
  }

  updateToggleLabel(label: HTMLElement) {
    label.textContent = isDarkMode.enabled ? 'Dark' : 'Light';
  }

  updateToggleIcon() {
    toggleIcon.icon = isDarkMode.enabled;
    this._lightModeToggleIcon.setAttribute('name', toggleIcon.icon);
    this._lightModeToggleIcon.setAttribute(
      'color',
      currentTheme.theme.properties['--theme-font-color-inverse']
    );
  }
}

window.customElements.define('light-mode-toggle', LightModeToggle);

export default LightModeToggle;
```

### About

So there is a good bit going on here, so let's start with that `LightModeToggleIcon` class I made in the beginning:

```js
class LightModeToggleIcon {
  private _icon: string;

  constructor(isDarkMode: boolean) {
    this._icon = isDarkMode ? 'moon' : 'sun';
  }

  get icon(): string {
    return this._icon;
  }

  set icon(isDarkMode: boolean) {
    this._icon = isDarkMode ? 'moon' : 'sun';
  }
}

let toggleIcon = new LightModeToggleIcon(isDarkMode.enabled);
```

The reason I set this up is because I wanted to be able to change my icon on the toggle by just assigning it as true or false, and not by the icon name. I did this because I felt as though if I had to do this in multiple places, and then one day decided to change the icon, it would be easier to just come to this class and change the name, rather than do a find and replace to change everything. The `isDarkMode` is handled by my `themeManager.ts`, so I don't need to worry about how that is being dealt with, all I need to know is that it knows when the site is in dark mode or not.

This probably could have been handled as an Object, and not a Class, but I was not sure how to use TypeScript to work the way I wanted to. It feels a bit clumsy to make a class that I only use one time, but it works well enough for me at this point.

As for the logic in my `LightModeToggle`, it actually contains logic related to the switch!

Let's start with the beginning of it:

```ts
  private _lightModeToggle: HTMLInputElement;
  private _lightModeToggleLabel: HTMLElement;
  private _lightModeToggleIcon: HTMLElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const clone = TPL_LightModeToggle.content.cloneNode(true);
    shadow.append(clone);

    this._lightModeToggle = this.shadowRoot?.querySelector('#themeToggle')!;

    this._lightModeToggleLabel =
      this.shadowRoot?.querySelector('.themeToggleLabel')!;

    this._lightModeToggleIcon = this.shadowRoot?.querySelector('box-icon')!;
  }
```

So this is just setup for the rest of the component. All I am doing here is declaring the elements I want to use, then assigning them.

```ts
  connectedCallback() {
    this._lightModeToggle!.addEventListener(
      'change',
      this.toggleLightMode.bind(this)
    );
    this._lightModeToggle!.checked = userPreferredLightMode();
    this.updateToggleLabel(this._lightModeToggleLabel!);
    this.updateToggleIcon();
```

The `connectedCallback()` function is called when the component is first created, and all it is doing here is initializing everything. It adds the event listener I want to the toggle itself, then it assigns its `checked` value based on if the user has a preference for dark mode or not. After that, the label then is also updated to say "Light" or "Dark" based on toggle. Finally, it updates the icon to also reflect what mode the site is in.

Let's look at how `toggleLightMode` works:

```ts
  toggleLightMode(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    isDarkMode.enabled = checkbox.checked;

    updateLightMode();

    this.updateToggleLabel(this._lightModeToggleLabel!);
    this.updateToggleIcon();
  }
```

Here I am storing the value of the event so that I can update my `isDarkMode` value on if the checkbox has been checked or not. Then my `updateLightMode()` function is called (which is in my `themeManager.ts`). Let's see how that works:

```ts
export function updateLightMode(): void {
  document.documentElement.setAttribute(
    'data-theme',
    isDarkMode.enabled ? 'dark' : 'light',
  );
  currentTheme.theme = isDarkMode.enabled ? darkMode : lightMode;

  document.dispatchEvent(themeChangeEvent);
}
```

All this is doing is setting a data attribute to dark or light, based on my `isDarkMode` value. The `currentTheme` object is a bit more complicated, as I wanted to make my own theme system. Storing the current theme was the way I solved handling how some colors work, as I now only have one place to update my themes colors, and they work both in my CSS and in any TypeScript I later make (which I need for some cases).

Anyway, the current theme is set to be in either dark mode or light mode, and then a custom event is dispatched. I set this up so that anything that isn't just affected by CSS can also change or update based on when the theme changes.

Let's finish up by looking at the last two functions in my `LightModeToggle.ts`:

```ts
  updateToggleLabel(label: HTMLElement) {
    label.textContent = isDarkMode.enabled ? 'Dark' : 'Light';
  }

  updateToggleIcon() {
    toggleIcon.icon = isDarkMode.enabled;
    this._lightModeToggleIcon.setAttribute('name', toggleIcon.icon);
    this._lightModeToggleIcon.setAttribute(
      'color',
      currentTheme.theme.properties['--theme-font-color-inverse']
    );
  }
```

The first function should be clear, it's just updating the text content in the label to dark or light.

The second function is updating the icon. If you recall from earlier, my `toggleIcon.icon` is actually a string, but you assign it using a `boolean`. This works well, because light/dark mode is a binary concept, so I can just assign the `.icon` value as the name of the dark/light icon simply based on if dark mode is enabled or disabled (0 or 1, false or true).

You can also see a case where I need to access my theme's colors in code. This is where storing the `currentTheme` comes in handy, as everything is stored in key-value pairs, so all I need to know is the key, and the value could be anything (as long as its a proper color format). In this case, my key is `--theme-font-color-inverse` which is both used here and my CSS.

I still don't find this to be a particularly elegant solution, but I do believe it is a huge improvement over my last implementation.
