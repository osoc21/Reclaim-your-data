# WePod Photo Web Application

The WePod Photo Web Application enables you to get back control over your photos that are stored in your very own [Solid pod](https://signup.pod.inrupt.com/). The project is the result of a partnership between [IDLab](https://idlab.technology/) and [Open Summer of Code](https://osoc.be/) (OSOC21), an initiative of [Open Knowledge Belgium](https://openknowledge.be/).

## Table of contents

- [Functionalities](#functionalities)
  - [Login](#login)
  - [Photos](#photos)
  - [Albums](#albums)
  - [Profile](#profile)
  - [Contacts](#contacts)
  - [Uploading images](#uploading-images)
  - [Metadata.json](#metadatajson-file)
- [Getting started](#getting-started)
  - [Setting up the application locally](#setting-up-the-application-locally)
  - [Running the application locally](#running-the-application-locally)

---

# Functionalities

## Login

A user can log in with their [Inrupt.com](https://podbrowser.inrupt.com/login) account. When the user is logged in, the application logic is handled in the `Home.js` file.

## Photos

When the user is logged in, they see an overview (grid view) of all the pictures that are stored in the `/images` folder of their Solid pod. The implementation of the grid view itself can be found in `GridView.js`.

## Albums

For now, the "Albums" button leads to a page with some dummy text (see `Albums.js`). In the future the app could be expanded so that a Solid pod "collection" (or folder if you will) corresponds to an album. Each collection would then have a `metadata.json` file (read more on this in the [Metadata](#metadatajson-file) section).

## Profile

On the profile page (`Profile.js`), the user can find back their profile details such as their WebId, Pod URL, e-mail and the role of their Solid pod profile. This profile is read-only and can be edited by using the [inrupt.com](https://podbrowser.inrupt.com) pod browser.

## Contacts

The contacts page (`Contacts.js`) shows a list of the user's contacts. When the user clicks one of their contacts, the app redirects them to the contact details page of that contact (`ContactDetails.js`).

The contacts are read-only in the WePod application, adding a contact can be done through [Inrupt](https://podbrowser.inrupt.com/login) 's pod browser.

## Uploading Images

A user can add new images to the root folder of their Solid pod by clicking/tapping the `+` in the top right corner of the app. The code for this functionality can be found in `FileUpload.js`. For each file that is being uploaded, a new entry in the `metadata.json` file is created.

Images are stored in the `/images` folder in the pod.

## Metadata.json File

The `metadata.json` file is an index file that contains entries of everything (e.g. folders or files) that is stored the `/images` folder of the Solid pod. Every entry of the array has the as described in the `metadata.json` example.

This file could in the future be expanded to also contain the GPS coordinates where a picture was taken for example, and then be queried on all the pictures taken in country X.  
Another idea for this file might be to keep track of which files correspond to an album, and having one `metadata.json` file per collection/album/folder.

> metadata.json

```json
[
  {
    "url": "https://pod.inrupt.com/<username>/path/to/image.jpg",
    "shortName": "<image.jpg>",
    "isFolder": false,
    "imageUrl": "blob:https://url/to/blob",
    "date": "<YYYY-MM-DDTHH:mm:ss.sssZ>"
  },
  {
    "url": "https://pod.inrupt.com/<username>/path/to/image2.jpg",
    "shortName": "<image2.jpg>",
    "isFolder": false,
    "imageUrl": "blob:https://url/to/blob2",
    "date": "<YYYY-MM-DDTHH:mm:ss.sssZ>"
  }
]
```

---

# Getting started

Make sure that [Git](https://git-scm.com/downloads) is installed.

Clone the project:

> `git clone https://github.com/osoc21/Reclaim-your-data.git`

*Note: The project was made in [ReactJs](https://reactjs.org/) with the [Inrupt JavaScript client libraries](https://docs.inrupt.com/developer-tools/javascript/client-libraries/). However, you might also want to check out Inrupt's [Solid React SDK](https://docs.inrupt.com/developer-tools/javascript/react-sdk/).*

## Setting up the application locally

[Node.js](https://nodejs.org/en/download/) and NPM are needed to run the application locally. Make sure to have an updated version installed (Node v10 or greater, npm v6 or greater).

Once these are installed, change directory to the project directory `Reclaim your data`.

Here, execute:

> `npm install`

and wait for the command to finish.

## Running the application locally

To run the application locally, execute:

> `npm start`

This launches the application in your default web browser at the following address: `localhost:3000`.

Once launched, you can log in with your pod provider (only [Inrupt.com](https://podbrowser.inrupt.com/login) is supported at this time) and access your pod.

*Note: The page will automatically reload if you make edits in the code and print any lint errors to the console.*
