# **THE SOUND OF SPACE**

This project was developed in the context of the "***Advanced Coding Tools and Methodologies***" course held at [Politecnico di Milano](https://www.polimi.it/) for the Master's Degree in [Music and Acoustic Engineering](https://suono.polimi.it/). The task was to design and implement a musical web application based on the `HTML`/`CSS`/`JavaScript` framework.

## *Concept*

The chosen architecture is that of a **generative computer music system**. Starting from an interactive, space-themed environment, the user is supposed to choose a picture from a pre-selected set of images representing stars and galaxies. The application then uses complex image processing algorythms to extract qualitative ***visual data*** from the picture (namely, its *color palette*, its *brightness*, etc.) and converts them to ***musical data*** (that is *mode*, *key*, *progression*, etc.), that are finally used to generate in real-time a **procedurally sequenced musical piece**. The result is achieved by sequencing different instruments and interlacing their *cyclic behaviour* according to different ratios. The resulting piece will have a **strong ambient flavor**, to reference the kind of soundscape people usually associate to space.

It is also possible to receive visual feedback about the musical fabric via the themed ***tridimensional graphical user interface***, which associates each played instrument to a revolving planet of the Solar System, as if it were a sort of drum machine.

## Overview

The application is structured in three web pages: the ***environment selection*** one, the that displays the ***extracted parameters*** and finally the ***graphical interface***. The user can choose to be led through each one of them *step by step*, by selecting the appropriate `GUIDE` button.

From a coding perspective, the data relative to the user's selections and the extracted parameters is saved and retrieved across pages by means of the `localStorage` read-only property of the `window` interface. This allows access to a `Storage` object for the `Document`'s origin, enabling the ***stored data*** to be **saved across browser sessions**.

### *Environment Selection*

The first page introduces the project and the set of pictures, inviting the user to make his selection. Each image was carefully selected based on its *unique features*, in order to generate a visibly different piece for each possible choice.

</br></br>
![Screenshot of the first page, the environment selection one.](Images/README/page1.png)
</br></br>

### *Extracted Parameters*

The second page displays the user-selected image and the extracted features, both visual and musical. On the left hand side are shown the ***color palette***, the ***key***, the ***mode***, the ***chord progression*** and the ***chord type***.
</br></br>

![Screenshot of the second page, the parameter extraction one.](Images/README/page2.png)
</br></br>

*The algorithms on which the extraction of the musical features from the image is based will be discussed in detail in a specific section, along with the corresponding visual parameters*.

### Graphical Interface

The last page is meant to give a visual representation of the interweaving musical textures by means of a graphic design inspired to our Solar System's aesthetic. Each planet corresponds to a synthesized sound, and its *period of revolution* is proportional to the ratio at which the corresponding note (or series of notes) is played. When the planet crosses the *median axis* of the screen (refer to the position in which the planets are represented in the image below), the note attack is triggered.

</br></br>
![Screenshot of the second page, the parameter extraction one.](Images/README/page3.png)
</br></br>

As the GUI suggests, the user can:

- Set the *volume* and the *playing ratio* for each planet (left menu);
- *Mute* all the planets;
- *Play* and *stop* the synth;
- Drag the mouse and/or scroll the mousewheel to *move in the 3D space*;
- Switch from a *tridimensional perspective* to a *bidimensional* one (and vice versa).

In addition, notice how the user-selected picture is wrapped around the skybox of the tridimensional space.
