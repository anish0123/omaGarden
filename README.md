# Oma Garden

Oma Garden is a mobile application built with React Native that allows users to upload and share pictures of their beloved plants. This app is designed to provide a seamless and user-friendly experience for plant enthusiasts. The main goal of this app is to bring together plant enthusiasts.

## Table Of Contents

1. [Features](#Features)
2. [Installation](#Installation)
3. [Usage](#Usage)
4. [Related](#Related)
5. [Video links](#video-links)
6. [App UI Screenshots](#App-UI-Screenshots)
7. [Contributors](#Contributors)
8. [Changes based on feedback](#Changes-based-on-feedback)

## Features

- Create a user account to check all uploaded plant pictures and videos.
- Upload plant pictures and videos and share them with other users.
- View other users' plant pictures and videos, add it in your favourites and comment on pictures and videos.
- Modify user account details and user avatars.
- Modify uploaded plant pictures and videos' details.
- Search for users to browse their uploaded plants pictures and videos.

## Installation

1. Clone the git repository.
2. Navigate to the project directory in the terminal.
3. Run `npm install`to install all the necessary dependencies.
4. Run `npm start`to start the development server.
5. Open the app on simulator or device.

Note: This app requires access to the phone camera and photo library to upload pictures.

## Usage

The app's landing page displays a grid of all uploaded plant pictures and videos. Users can click on heart icon to like the post. If it's already liked the heart icon will be red. Users can check the list of users who have liked the plant picture or video by clicking on text "liked By..". Users can click on the picture or the comment icon to go to single page. Single page displays the details about the pictures and videos. Users are also able to comment on the pictures and videos in the single page.

To search for specific users, users can click on the search icon on the bottom navigator. Type in desired search and the app will display the matching user lists. Users can click on user in the displayed list and it will navigate to the clicked user profile, where user can check all clicked user's detail and uploaded plant pictures and videos.

To upload a plant picture or video, users can click on the upload icon on bottom navigator. This will take user to upload page where user can open the camera or photo library on their device. Users also need to add title but the description is not mandatory. Users can reset all the input by the reset button but if everything is okay user can click upload button for the upload.

To check the user profile, users can click on profile icon on bottom navigator. User profile page displays all the details about the user. It also displays all the plant pictures and videos uploaded by the user. The total number of likes that user have received through their posts are also displayed in the page. Users can also change their avatar by clicking on the camera icon on the left side of the avatar.

## Related

- [Trello Board](https://trello.com/b/WTILLlHy/oma-garden)
- [Figma](https://www.figma.com/file/QtuGVpHjtlDHnEMJqyBnyh/Oma-Garden-Group-Project?node-id=7%3A356&t=srHAycuxs5o17iI2-0)


## Video links

- [App Demo](https://youtu.be/vYvVIv3UzAw)
- [Promotional Video](https://youtube.com/shorts/jl9GDpnDF6A)

## App UI Screenshots
<p>
<img src= "https://user-images.githubusercontent.com/87969471/224488330-0412d2fb-d092-4de2-a1a0-4d7800567a8b.png" width="200" height="400" />
<img src="https://user-images.githubusercontent.com/87969471/224488522-6e182d92-615c-4015-bb38-6f1d5d4d6a06.png" width="200" height="400" />
<img src="https://user-images.githubusercontent.com/87969471/224488538-5d81d0fb-201c-43c2-aaa3-0df06813db94.png" width="200" height="400" />
<img src="https://user-images.githubusercontent.com/87969471/224488550-19aa6b4b-6e08-40be-861e-fe7715f5c27c.png" width="200" height="400" />
<img src="https://user-images.githubusercontent.com/87969471/224488651-b4454288-2029-449d-aeb1-e8a434af5677.png" width="200" height="400" />
<img src="https://user-images.githubusercontent.com/87969471/224488671-2cab92bc-bb33-41b0-bb1b-163ac9dc6119.png" width="200" height="400" />
<img src="https://user-images.githubusercontent.com/87969471/224488561-196dad7c-7ab6-457e-adae-8e4baeebe4b6.png" width="200" height="400" />
<img src="https://user-images.githubusercontent.com/87969471/224488573-813a6339-4b86-4f03-9932-32f936c5b1e5.png" width="200" height="400" />
<img src="https://user-images.githubusercontent.com/87969471/224488587-172f4916-3678-43a1-bb25-39f4453d73cd.png" width="200" height="400" />
<img src="https://user-images.githubusercontent.com/87969471/224488602-b9ed9346-e1df-4fee-ae7c-ce8e0bdbf60f.png" width="200" height="400" />
<img src="https://user-images.githubusercontent.com/87969471/224488628-4ff620b9-fac2-46e7-9eda-24484900e9b2.png" width="200" height="400" />
  </p>


## Contributors

- [Anish Maharjan](https://github.com/anish0123)
- [Asmita Shrestha](https://github.com/asmita143)
- [Prabin Dhakal](https://github.com/Prabin1500)


## Changes based on feedback
- Bigger Hamburger Menu
- Fixed the positioning of media in home page so it does not go behind the bottom navigator.
- Better error handlers are implemented using alert, if some tasks(for example: upload image, register user) failed.
- No error prompt to user if user wants to change other info but keeps the same username while editing user profile.
