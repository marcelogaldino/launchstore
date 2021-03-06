const Mask = {
    apply(input, func) {
        setTimeout( () => {
        
            input.value = Mask[func](input.value)

        }, .5)
    },

    formatBRL(value) {
        value = value.replace(/\D/g, "")

        return value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)
    
    }
}

const PhotosUpload = {
    input: "",
    limitUpload: 6,
    preview: document.querySelector('#photos-preview'),
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target        
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            const reader = new FileReader()

            PhotosUpload.files.push(file)

            reader.onload = () => {
                const image = new Image
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }
            
            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)
        
        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    hasLimit(event) {
        const { limitUpload, input, preview } = PhotosUpload
        const { files: fileList } = input

        if(fileList.length > limitUpload) {
            alert(`Envie no maximo ${limitUpload} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == 'photo') {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length

        if(totalPhotos > limitUpload) {
            alert(`Você atingiu o limite máximo de ${limitUpload} fotos`)
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode // event.target -> <i> // event.targer.parentNode -> <div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode
        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if(removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        console.log(ImageGallery.previews)
        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')


        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open(){
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    close(){
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}