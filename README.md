# Homepage Custom Modal

A `custom.js` script for use with [gethomepage.dev](https://gethomepage.dev) that allows sending custom, optionally password-protected, GET or POST requests on a local network. It modifies existing bookmarks defined in `bookmarks.yaml` that are marked with a specific id. Instead of following the href, these bookmarks are modified to open a modal on-click allowing the user to send an (authenticated) HTTP request.

## Purpose

The script enables binding bookmarks to custom requests. For example, it can be used to remotely start devices or servers by sending POST requests when a bookmark is clicked.

## ⚠️ Warning

[gethomepage.dev](https://gethomepage.dev) by default serves pages over plain HTTP and provides no built‑in security.
Passwords entered through this script are **not** protected. They should be treated as obfuscation or accidental‑trigger prevention, not as real authentication.

- Do **not** use passwords you use elsewhere.

- Do **not** expose sensitive or high‑risk actions through this system.

Requests that could cause data loss or security issues (e.g., shutdown/reboot, deletion, unsafe control commands) should **not** be placed behind this mechanism.

Use this script **at your own risk**. It is intended for low‑impact, local‑only, temporary solutions (e.g., starting a local server).

## Configuration

Each actionable bookmark must have a corresponding entry in the `CONFIG` array in `custom.js`. Example:

```javascript
{
    id: "printer_on",
    url: "http://192.168.2.9:5455/printer/on",
    header: "X-Auth-Token:SECRET_TOKEN",
    password: "",
    message: "Enter password to start the printer"
}
```

* **id**: Unique identifier, must match the `id` used in `bookmarks.yaml`.
* **url**: The URL for the GET or POST request.
* **header**: OOptional. Specify a single header as `Key:Value`. Example: `"X-Auth-Token:SECRET_TOKEN"`.
* **password**: Optional. If empty, whatever the user enters in the password field is sent as the auth header. If filled, the configured header is sent only if the user enters the correct password.
* **message**: Text to display in the password prompt.

## Bookmark Setup

Bookmarks are defined in `bookmarks.yaml` like this:

```yaml
- Start Printer:
    - abbr: SP
      href: "http://localhost:8384"
      id: printer_on
```

* **href**: Required to prevent gethomepage.dev from erroring. It will be overwritten by the script.
* **id**: Must match an `id` in the `CONFIG` array.

## Usage

1. Add the script `custom.js` to your gethomepage.dev project.
2. Define bookmarks in `bookmarks.yaml` with `id`s that correspond to the `CONFIG` entries.
3. Configure each entry in `CONFIG` with the target URL, optional password, headers, and message.
4. When a bookmark is clicked, a password prompt appears (if configured). The script sends the corresponding GET or POST request with the appropriate authentication.

The script supports multiple bookmarks and will automatically attach the behavior to any bookmark whose `id` matches a `CONFIG` entry.
