import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spinner } from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

const Profile = ({
    getProfileById,
    profile: { profile, loading },
    auth,
    match
}) => {
    const id = useParams();

    useEffect(() => {
        console.log('profile.useEffect=====>', id)
        getProfileById(id);
    }, [getProfileById]);

    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> : <Fragment>
                <Link to='/profiles' className='btn btn-light'>
                    Back To Profiles
                </Link>
            </Fragment>}
        </Fragment>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, { getProfileById })(Profile);
