import '@styles/github-button-widget.styl';
import template from './github-button-widget.html';

const GITHUB_BASE_URL = 'https://github.com';

export default {
  name: 'github-button-widget',
  props: [
    'username',
    'repositoryName'
  ],
  data(){
    return {
      repositoryLink: null,
      ariaLabel: null
    };
  },
  mounted(){
    const slug = this.buildRepositorySlug(this.username, this.repositoryName);
    this.setRepositoryLink(this.buildRepositoryLink(slug));
    this.setAriaLabel(this.buildAriaLabel(slug));
    this.appendGithubScriptTagOnBody(this.getGithubScriptTag());
  },
  methods: {
    buildRepositorySlug(username, repositoryName){
      return `${username}/${repositoryName}`;
    },
    buildRepositoryLink(repositorySlug){
      return `${GITHUB_BASE_URL}/${repositorySlug}`;
    },
    setRepositoryLink(link){
      this.repositoryLink = link;
    },
    buildAriaLabel(repositorySlug){
      return `Star ${repositorySlug} on GitHub`;
    },
    setAriaLabel(label){
      this.ariaLabel = label;
    },
    appendGithubScriptTagOnBody(tag){
      document.body.appendChild(tag);
    },
    getGithubScriptTag(){
      const existingTag = document.querySelector('[data-github-script-tag]');
      if(existingTag)
        existingTag.remove();
      return this.buildGithubScriptTag();
    },
    buildGithubScriptTag(){
      const tag = this.buildGithubBaseScriptTag();
      tag.setAttribute('data-github-script-tag','');
      return tag;
    },
    buildGithubBaseScriptTag(){
      const tag = document.createElement('script');
      tag.setAttribute('async', 'true');
      tag.setAttribute('defer', '');
      tag.setAttribute('src', 'https://buttons.github.io/buttons.js');
      return tag;
    }
  },
  template
};
