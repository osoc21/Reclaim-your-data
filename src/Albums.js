
import React from "react";

/**
 * The Albums component displays folder like structures that gather
 * images according to tags or location on the POD. Consequently, the implementation
 * of the component is heavily implementation dependent: files can be grouped
 * according to their parent folder on the POD, or according to index files
 * and dynamic faceted search algorithms. Currently, the Albums component is filled with dummy
 * data.
 *
 * @component
 * @param {[type]} props [description]
 */
function Albums(props)
{
	return (
		<>
			<h1>Albums</h1>
			<h2>Your albums</h2>
			<p>album1</p>
			<p>album1</p>
		</>
	);
}

export default Albums;