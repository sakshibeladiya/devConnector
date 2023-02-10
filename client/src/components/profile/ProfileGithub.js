// import React from 'react'
// import PropTypes from 'prop-types';
// import { Spinner } from '../layout/Spinner';
// import { connect } from 'react-redux';
// import { getGithubRepose } from '../../actions/profile';

// const ProfileGithub = ({ username, getGithubRepose, repos }) => {
//     console.log('username=====github ==', username)

//     useEffect(() => {
//         getGithubRepose(username);
//     }, [getGithubRepose]);
//     console.log('username=====', username)
//     return (
//         <div className='profile-github'>
//             <h2 className='text-primary my-1'> Github Repos</h2>
//             {repos === null ? (
//                 <Spinner />
//             ) : (
//                 repos.map(repo => (
//                     <div key={repo._id} className='repo bg-white p-1 my-1'>
//                         <div>
//                             <h4>
//                                 <a href={repo.html_url}
//                                     target='_blank'
//                                     rel='noopener noreferrer'>
//                                     {repo.name}
//                                 </a>
//                             </h4>
//                             <p>{repo.description}</p>
//                         </div>
//                         <div>
//                             <ul>
//                                 <li className='badge badge-primary'>
//                                     Stars: {repo.stargazers_count}
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 ))
//             )}
//         </div>
//     )
// }

// ProfileGithub.propTypes = {
//     getGithubRepose: PropTypes.func.isRequired,
//     repos: PropTypes.array.isRequired,
//     username: PropTypes.string.isRequired,
// }

// const mapStateToProps = state => ({
//     repos: state.profile.repos
// })

// export default connect(mapStateToProps, { getGithubRepose })(ProfileGithub)



import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getGithubRepos } from '../../actions/profile';
const ProfileGithub = ({ username, getGithubRepos, repos }) => {
    useEffect(() => {
        console.log('didmount======');
        getGithubRepos(username);
    }, [getGithubRepos]);
    return (
        <div className='profile-github'>
            <h2 className='text-primary my-1'>Github Repos</h2>
            {repos === null ? (
                <Spinner />
            ) : (
                repos.map((repo) => (
                    <div key={repo._id} className='repo bg-white p-1 my-1'>
                        <div>
                            <h4>
                                <a
                                    href={repo.html_url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    {repo.name}
                                </a>
                            </h4>
                            <p>{repo.description}</p>
                        </div>
                        <div>
                            <ul>
                                <li className='badge badge-primary'>
                                    Stars: {repo.stargazers_count}
                                </li>
                                <li className='badge badge-dark'>
                                    Watchers: {repo.watchers_count}
                                </li>
                                <li className='badge badge-light'>Forks: {repo.forks_count}</li>
                            </ul>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

ProfileGithub.propTypes = {
    getGithubRepos: PropTypes.func.isRequired,
    repos: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
    repos: state.profile.repos,
});
export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);