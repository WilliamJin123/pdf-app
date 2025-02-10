import icons from "../assets/icons/icons"
import PropTypes from 'prop-types';

FileIcon.PropTypes = {
    imageStyles: PropTypes.string,
    fileType: PropTypes.string
}

export default function FileIcon({ imageStyles, fileType }) {

    console.log(fileType)

    const fileExtension = fileType.split('/').pop().toLowerCase();

    console.log(fileExtension)



    const imgSrc = icons[fileExtension] || icons.none;

    
    return (
        <img src={imgSrc} className={`${imageStyles}`} />
    )
}