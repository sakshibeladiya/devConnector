import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const ProfileItem = ({
    profile
}) => {
    return (
        <div className='profile bg-light'>

            <img src={Object.keys(profile).length > 0 && profile.user && profile.user.avatar} alt="photo" className='round-img' />
            <div>
                <h2>{Object.keys(profile).length > 0 && profile.user && profile.user.name}</h2>
                <p>{Object.keys(profile).length > 0 && profile.status} {Object.keys(profile).length > 0 && profile.company && <span> at {profile.company} </span>}</p>
                <p className='my-1'> {Object.keys(profile).length > 0 && profile.location && <span> {profile.location}</span>}</p>
                <Link to={`http://localhost:8000/profile/${Object.keys(profile).length > 0 && profile.user && profile.user._id}`} className="btn btn-primary">
                    View Profile
                </Link>
            </div>
            <ul>
                {Object.keys(profile).length > 0 && profile.skills && profile.skills.slice(0, 4).map((skill, index) => (
                    <li key={index} className="text-primary">
                        <i className='fas fa-check'></i>{skill}
                    </li>
                ))}
            </ul>
        </div>
    )
}

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired,

}

export default ProfileItem;

