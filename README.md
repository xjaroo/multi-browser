# Multi-Browser

An Electron application to display and interact with multiple websites simultaneously in a single window. It's designed to streamline workflows by sending the same input (like a prompt for AI chatbots) to multiple services at once.

By default, it is configured to show ChatGPT, Google Gemini, and Anthropic Claude.

## Features

- Display 1 to 3 websites side-by-side.
- A central input bar to send text/prompts to all websites at once.
- Custom JavaScript injection tailored for popular AI chat services.
- Configurable websites via a settings panel.
- Keyboard shortcuts for common actions.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation) package manager

### Installation

1.  Clone the repository:
    ```sh
    git clone https://bitbucket.org/remsmart/multi-browser.git
    cd multi-browser
    ```
2.  Install dependencies:
    ```sh
    pnpm install
    ```

### Running the Application

To start the application in development mode, run:

```sh
pnpm start
```

## How to Use

- The application will launch and display the configured websites.
- Use the text area at the bottom of the window to type your message or prompt.
- Click **Send** or press Enter to submit the text to all web views simultaneously.
- Click the **Settings** button in the top-left corner to open the configuration modal where you can change the URLs for the web views.

### Keyboard Shortcuts

| Shortcut          | Action                               |
| ----------------- | ------------------------------------ |
| `CmdOrCtrl+Alt+A` | Show/Hide the main input bar         |
| `CmdOrCtrl+Alt+S` | Open the Site Configuration settings |
| `CmdOrCtrl+Alt+1` | Open DevTools for the 1st website    |
| `CmdOrCtrl+Alt+2` | Open DevTools for the 2nd website    |
| `CmdOrCtrl+Alt+3` | Open DevTools for the 3rd website    |

## Building the Application

You can build the application for your platform using the following commands:

- **Windows:** `pnpm run build:win`
- **macOS:** `pnpm run build:mac`
- **Linux:** `pnpm run build:linux`
- **All platforms:** `pnpm run build:all`

The packaged application will be located in the `dist` directory.

## How it Works

The application uses Electron's `BrowserView` to create separate web browsing instances within a single `BrowserWindow`. The main window contains a control panel (`index.html`) with an input field. When you send a message, the main process injects a JavaScript snippet into each `BrowserView` to find the correct input field on the page, populate it with your text, and submit the form.

The list of websites is stored in `sites.json` and can be modified through the in-app settings.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a pull request.

## License

This project is licensed under the MIT License.
