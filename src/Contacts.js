import {useState, React, useEffect} from "react";
import {executeQuery} from "./rdf";
import "./Contacts.css";
import {useSession} from "@inrupt/solid-ui-react";
import PersonIcon from '@material-ui/icons/Person';

const getContactsBasicInfoQuery = "SELECT ?s ?o WHERE {?s <http://www.w3.org/2006/vcard/ns#fn> ?o}";

/**
 * The Contacts components gathers the contacts of the current user.
 * The contacts are fetched using a simple rdf query, storing the results in a state variable.
 *
 * @component
 * @param {[type]} props The webId (string), the gotoScreen function and the podUrl (string)
 */
function Contacts(props) {
    let webId = props.webId;
    let gotoScreen = props.gotoScreen;
    let podURL = props.podUrl;

    const {session} = useSession();
    const [bindings, setBindings] = useState([]);

    /**
     * Uses the pod url to fetch the people.ttl turtle file on the POD, subsequently being able
     * to query the file for contact names and their associated 'person-files'.
     * The result bindings are stored in a state variable. 
     * @return {[type]} [description]
     */
    async function fetchContacts() {
        let getContactsBasicInfoSource = podURL + "contacts/people.ttl#this";
        let resBindings = await executeQuery(getContactsBasicInfoQuery, [getContactsBasicInfoSource], session);
        await setBindings(resBindings);
    }

    useEffect(() => {
        fetchContacts();
    }, [webId]);

    /**
     * The Contact component encapsulates the name of the user and it 'person-file' url,
     * and allows the user to click on it to display more data about the contact.
     * When clicked, a page switch is triggered by changing the path of the router
     * and parameterize it with the name of the person.
     * Notice that the person-file url is actually used to get the contact details, but is passed
     * to the router in a hidden way to have a clearer url displayed in the browser and avoid unescaped
     * character problems.
     * @param {[type]} props [description]
     */
    function Contact(props) {
        let binding = props.binding;

        let username = binding['_root'].entries[1][1]['id'].replace(/['"]+/g, '');
        let turtleFileUrl = binding['_root'].entries[0][1]['id'].replace(/['"]+/g, '');

        return (
            <div className="contact">
                <PersonIcon/>
                <p className="contact-name"
                   onClick={() => gotoScreen(`/contacts/${username}`, [turtleFileUrl])}>{username}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Contacts</h1>
            {bindings.map((binding, idx) => {
                console.log("Binding:", binding);
                return (<Contact key={idx} binding={binding}/>)
            })}
        </div>
    );
}

export default Contacts;