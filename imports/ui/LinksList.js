import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Links } from '../api/links';
import { Segment } from 'semantic-ui-react';
import { Session } from 'meteor/session';

import LinksListItem from './LinksListItem.js'

export default class LinksList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      links: [],
    };
  }

  // After the component is rendered, this method will be called.
  componentDidMount(){
    //console.log('componentDidMount LinksList');

    this.linksTracker = Tracker.autorun(() => {
      Meteor.subscribe('links');
      const links = Links.find({
        visible: Session.get('showVisible')
      }).fetch();
      this.setState({links});
    });
  }

  // Function called when the component is removed.
  componentWillUnmount(){
    //console.log('componentWillUnmount LinksList');
    this.linksTracker.stop();
  }

  renderLinksListItems(){
    return this.state.links.map( (link) => {
      // Append the link._id to the current absoluteUrl.
      const shortUrl = Meteor.absoluteUrl(link._id);
      // {...link} passes all elements in link as props to the component
      return <LinksListItem key={link._id} {...link} shortUrl={shortUrl} />;
    });
  }

  render() {
    return(
      <Segment>
        {this.renderLinksListItems()}
      </Segment>
    );
  }
}
