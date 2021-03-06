
export class LightBox {
    //this.medium
    //this.index
    constructor(arrayMedia, idMedia, selectedPhotographer) {
        if (!(Array.isArray(arrayMedia) && arrayMedia.length > 0)) {
            return;
        }
        if (selectedPhotographer === undefined) {
            return
        }
        let currentMedia = arrayMedia.find(e => e.id == idMedia);

        if (currentMedia === undefined) {
            return;
        }

        this.photograph = selectedPhotographer;
        this.arrayMedia = arrayMedia;

        for (let index = 0; index < arrayMedia.length; index++) {
            const element = arrayMedia[index];
            if (element === currentMedia) {
                this.index = index;
                return;
            }
        }
    };

    render() {
        let medium = this.arrayMedia[this.index];
        switch (medium.constructor.name.toLowerCase()) {
            case "photo":
                return this.renderBoxPhoto(medium);
                break;
            case "video":
                return this.renderBoxVideo(medium);
                break;
            default:
                break;
        }
    }

    nextMedia() {
        // tester le tableau et l'index
        if (this.index !== undefined && this.arrayMedia !== undefined
            && this.index >= 0 && this.index < this.arrayMedia.length) {
            this.index++;
            console.log(this.index)
            if (this.index >= this.arrayMedia.length) {
                this.index = 0;
            }
        }
    }

    previousMedia() {
        if (this.index !== undefined && this.arrayMedia !== undefined
            && this.index >= 0 && this.index < this.arrayMedia.length) {
            this.index--;
            if (this.index < 0) {
                this.index = this.arrayMedia.length - 1;
            }
        }
    }

    getLastMediaId() {
        this.medium = this.arrayMedia[this.index];
        return this.medium.id
    }

    renderBoxPhoto(medium) {
        return (`
            <div class="lightbox__img" tab-index="-1"><img src="images/${this.photograph.folderName()}/${medium.fileImage}" alt="${medium.title}"></div>
            <p class="lightbox__title">${medium.title}</p>
        `)
    }

    renderBoxVideo(medium) {
        return (`
            <div class="lightbox__video" tab-index="-1"><video controls src="images/${this.photograph.folderName()}/${medium.fileVideo}" alt="${medium.title}" type="video/mp4"></div>
            <p class="lightbox__title">${medium.title}</p>
        `)
    }
}
