import React, { useMemo, useReducer, useContext, useState, useEffect } from 'react';
import ProjectContext, { DispatchContext, StateContext } from '../imports/contexts/ProjectContext';
import { initialState, projectReducer } from '../imports/reducers/projectReducer';

import FirebaseContext from '../imports/contexts/FirebaseContext';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import EditorToolbar from '../components/project/toolbar';
import Canvas from '../components/project/canvas';

function Project(props) {
	const { projectId } = useParams();
	const [ state, dispatch ] = useReducer(projectReducer, initialState);
	const firebase = useContext(FirebaseContext);
	const [ loading, isLoading ] = useState(true);
	//const [ project, setProject ] = useState({});

	useEffect(() => {
		console.log('firing in useEffect on mount');
		if (projectId) {
			firebase
				.projects()
				.doc(projectId)
				.get()
				.then((doc) => {
					if (doc.exists) {
						dispatch({ type: 'load', payload: { state: doc.data().state } });
						isLoading(false);
						//setProject(doc.data());
					} else {
						console.log('No such document!');
					}
				})
				.catch((error) => {
					console.log('Error getting document:', error);
				});
		}
	}, []);

	return (
		<DispatchContext.Provider value={dispatch}>
			<StateContext.Provider value={state}>
				<EditorToolbar />
				<Grid container justify="center" id="conatiner" style={{ marginTop: '100px' }}>
					<Grid item xs={12} style={{ margin: '20px' }}>
						{loading && <h2>Loading</h2>}
						{!loading && <Canvas side={'front'} />}
					</Grid>
					<Grid item xs={12} style={{ margin: '20px' }}>
						{!loading && <Canvas side={'back'} />}
					</Grid>
				</Grid>
			</StateContext.Provider>
		</DispatchContext.Provider>
	);
}

export default Project;

/**
 * <ProjectContext.Provider value={{ state, dispatch }}></ProjectContext.Provider>
 */
