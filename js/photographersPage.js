
import { getData } from '../js/data.js';
import { Photograph } from '../js/photograph_class.js';
import { MediaFactory } from './factory_class.js';
import { modalManagement } from '../js/modal.js';
import { wrapperSelect, getUrlParameter } from '../js/fonctions.js';

/* ============================= Récupérer le photographe lié à cet ID ============================= */

function findPhotographer(photographersData, photographerId) {
    const photographerData = photographersData.find(photographer => photographer.id === photographerId);

    return new Photograph(photographerData);
}

/* ============================= Générer les Medias  ============================= */
/*
function isVideo(mediumData) {
    return mediumData.video !== undefined;
}
function isPhoto(mediumData) {
    return mediumData.image !== undefined;
}

// collection de vidéo et de photos
function createAllMedia(mediaData) {
    //console.log(mediaData)
    return mediaData.map(mediumData => {
        let medium;

        if (isVideo(mediumData)) {
            medium = new Video(mediumData)
        } else if (isPhoto(mediumData)) {
            medium = new Photo(mediumData)
        }
        return medium;
    })
}
*/

// Gestion de la factoryMedia filtré selon l'iD photographe
function photographerMedia(mediaData, photographer) {
    const photographersMediaData = mediaData.filter(mediumData => mediumData.photographerId === photographer.id);
    const photographersMedia = photographersMediaData.map(mediumData => MediaFactory.createMedium(mediumData))
    return photographersMedia;
}

/* ============================= Gestion du tri des Medias  ============================= */

function sortByLikes(selectedMedia) {
    return selectedMedia.sort((a,b) => {
        return b.likes - a.likes;
    });
}

function sortByDate(selectedMedia) {
    return selectedMedia.sort((a,b) => {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateB - dateA;
    });
    // return selectedMedia.sort((a,b) => {
    //     new Date(a.date) - new Date(b.date);
    // });
}

function sortByTitle(selectedMedia) {
    return selectedMedia.sort((a,b) => {
        let stringA = a.title.toLowerCase();
        let stringB = b.title.toLowerCase();
        if (stringA < stringB) {return -1;}
        if (stringA > stringB) {return 1;}
        return 0;
    });
}

function mediaSelectedHtml(selectedMedia, selectedPhotographer) {
    for (const option of document.querySelectorAll(".select__options")) {
        option.addEventListener('click', function(e) {
            let selectedDataValue = e.target.getAttribute('data-value');
            let sortedMedia;
            if (selectedDataValue === 'Likes') {
                sortedMedia = sortByLikes(selectedMedia); 
            }
            else if (selectedDataValue === 'Date') {
                sortedMedia = sortByDate(selectedMedia);
            }
            else if (selectedDataValue === 'Title') {
                sortedMedia = sortByTitle(selectedMedia);
            }
            const sortedMediaHtml = sortedMedia.map(medium => medium.render(selectedPhotographer)).join(' ');

            document.querySelector('.gallerycontainer').innerHTML = sortedMediaHtml;
        });     
    }
}

/* ============================= Rendu des Medias  ============================= */

function photographerMediaHtml(selectedMedia, selectedPhotographer) {
    //console.log(selectedMedia);
    return selectedMedia.map(medium => medium.render(selectedPhotographer)).join(' ');
}

/* ============================= Likes totaux du photographe ============================= */

function photographerLikesSum(selectedMedia) {
    let sumLikes = 0;
    for(const numberOfLikes of selectedMedia) {    
        sumLikes += numberOfLikes.likes
    }
    return sumLikes;
    // Avec Reducer ??
    //return selectedMedia.reduce((previousMedia , currentMedia) => previousMedia.likes + currentMedia.likes);
}

/* ============================= Incréementer les médias de la galerie ============================= */

function incrementGalleryLikes(selectedMedia, gallerySelected) {
    const targetGallery = gallerySelected.childNodes[1];
    let targetGalleryNumber = parseInt(targetGallery.innerHTML, 10);
    let currentGalerieMedia = selectedMedia.find(element => element.likes === targetGalleryNumber)

    if(targetGalleryNumber === currentGalerieMedia.likes) {
        targetGalleryNumber++;
    }
    targetGallery.innerHTML = targetGalleryNumber;
}
function incrementSumLikes(photographLikesContainer) {
    let allLikescontainer = photographLikesContainer.childNodes[1].firstElementChild;
    let likesnumber = parseInt(allLikescontainer.innerHTML,10);
    likesnumber++;
    allLikescontainer.innerHTML = likesnumber;
}

// On target la ="div" parente pour incrménter au clic sur le coeur ou le nombre
function addLikes(selectedMedia, photographLikesContainer) {
    document.addEventListener('click', e => {
        let gallerySelected = e.target.closest('div');
        if (e.target.closest('div') && e.target.closest('div').classList == 'gallery__like') {
            //do something
            incrementGalleryLikes(selectedMedia, gallerySelected);
            incrementSumLikes(photographLikesContainer)
        }
    });
}

/* ============================= Gestion de la page ============================= */

const mainPhotographer = function () {
    getData().then(({photographers: photographersData, media: mediaData}) => {
        // Id du photographe de l'url
        const photographerId = parseInt(getUrlParameter('id'), 10);

        // on cible les containers dans le DOM
        const photographContainer = document.querySelector('.contactcontainer');
        const galleryContainer = document.querySelector('.gallerycontainer');
        const photographModalContainer = document.querySelector('.modal__title');
        const photographLikesContainer = document.querySelector('.likescontainer');

        // on récupere le data du photographe selectionné et ses médias
        const selectedPhotographer = findPhotographer(photographersData, photographerId);
        const selectedMedia = photographerMedia(mediaData, selectedPhotographer);
        const selectedMediaAllLikes = photographerLikesSum(selectedMedia);
        addLikes(selectedMedia, photographLikesContainer);
        //console.log(selectedMediaAllLikes)
        
       // on créer les rendu Html
        const photographerHtml = selectedPhotographer.photographerRender();
        const photographerModalHtml = selectedPhotographer.photographerModalRender();
        const photographerLikesHtml = selectedPhotographer.photographLikesRender(selectedMediaAllLikes);

        // on envois les rendus dans le DOM 
        photographContainer.innerHTML = photographerHtml;
        photographModalContainer.innerHTML = photographerModalHtml;
        photographLikesContainer.innerHTML = photographerLikesHtml;
        galleryContainer.innerHTML = photographerMediaHtml(selectedMedia, selectedPhotographer);
        mediaSelectedHtml(selectedMedia, selectedPhotographer);
    });
}

mainPhotographer();
modalManagement();
wrapperSelect();