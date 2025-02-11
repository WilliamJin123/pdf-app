import icons from "../assets/icons/icons"
import PropTypes from 'prop-types';

FileIcon.PropTypes = {
    imageStyles: PropTypes.string,
    fileType: PropTypes.string
}

export default function FileIcon({ imageStyles, fileType }) {
    const fileExtension = fileType.split('/').pop().toLowerCase();
    const imgSrc = icons[fileExtension] || icons.file;

    
    return (
        <img src={imgSrc} className={`${imageStyles}`} />
    )
}