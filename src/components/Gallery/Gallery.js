import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';


class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      items: 100
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=`+this.state.items+'&format=json&nojsoncallback=1';
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({images: res.photos.photo});
        }
      });
  }
  isBottom(el) {
    return Math.round(el.getBoundingClientRect().bottom) <= window.innerHeight;
  }
  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
     document.addEventListener('scroll', this.trackScrolling);
  }
  trackScrolling = () => {
    const gallery = document.getElementById('gallery');
    if (this.isBottom(gallery)) {
      this.setState.items = this.state.items+=100;
       this.getImages(this.props.tag);
    }
  };
  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }
    onChildChanged(url) {
      this.props.callbackParent(url);
        }
  render() {
    return (
      <div id = "gallery" className="gallery-root">
        {this.state.images.map(dto => {
          return <Image callbackParent={url => this.onChildChanged(url)} key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}/>;
        })}
      </div>
    );
  }
}

export default Gallery;
