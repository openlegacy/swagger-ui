import React, { cloneElement } from "react"
import PropTypes from "prop-types"

//import "./topbar.less"
import Logo from "./logo_small.png"
import {parseSearch, serializeSearch} from "../../core/utils"

export default class Topbar extends React.Component {

  static propTypes = {
    layoutActions: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    this.state = { url: props.specSelectors.url(), selectedIndex: 0 }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ url: nextProps.specSelectors.url() })
  }

  onUrlChange =(e)=> {
    let {target: {value}} = e
    this.setState({url: value})
  }

  loadSpec = (url) => {
    this.props.specActions.updateUrl(url)
    this.props.specActions.download(url)
  }

  onUrlSelect =(e)=> {
    let url = e.target.value || e.target.href
    this.loadSpec(url)
    this.setSelectedUrl(url)
    e.preventDefault()
  }

  downloadUrl = (e) => {
    this.loadSpec(this.state.url)
    e.preventDefault()
  }

  setSearch = (spec) => {
    let search = parseSearch()
    search["urls.primaryName"] = spec.name
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    if(window && window.history && window.history.pushState) {
      window.history.replaceState(null, "", `${newUrl}?${serializeSearch(search)}`)
    }
  }

  setSelectedUrl = (selectedUrl) => {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []

    if(urls && urls.length) {
      if(selectedUrl)
      {
        urls.forEach((spec, i) => {
          if(spec.url === selectedUrl)
            {
              this.setState({selectedIndex: i})
              this.setSearch(spec)
            }
        })
      }
    }
  }

  componentWillMount() {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []

    if(urls && urls.length) {
      let primaryName = configs["urls.primaryName"]
      if(primaryName)
      {
        urls.forEach((spec, i) => {
          if(spec.name === primaryName)
            {
              this.setState({selectedIndex: i})
            }
        })
      }
    }
  }

  componentDidMount() {
    const urls = this.props.getConfigs().urls || []

    if(urls && urls.length) {
      this.loadSpec(urls[this.state.selectedIndex].url)
    }
  }

  onFilterChange =(e) => {
    let {target: {value}} = e
    this.props.layoutActions.updateFilter(value)
  }

  render() {
    let { getComponent, specSelectors, getConfigs } = this.props
    const Button = getComponent("Button")
    const Link = getComponent("Link")

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"

    let inputStyle = {}
    if(isFailed) inputStyle.color = "red"
    if(isLoading) inputStyle.color = "#aaa"

    const { urls } = getConfigs()
    let control = []
    let formOnSubmit = null

    if(urls) {
      let rows = []
      urls.forEach((link, i) => {
        rows.push(<option key={i} value={link.url}>{link.name}</option>)
      })

      control.push(
        <label className="select-label" htmlFor="select"><span>Select a spec</span>
          <select id="select" disabled={isLoading} onChange={ this.onUrlSelect } value={urls[this.state.selectedIndex].url}>
            {rows}
          </select>
        </label>
      )
    }
    else {
      formOnSubmit = this.downloadUrl
      control.push(<input className="download-url-input" type="text" onChange={ this.onUrlChange } value={this.state.url} disabled={isLoading} style={inputStyle} />)
      control.push(<Button className="download-url-button" onClick={ this.downloadUrl }>Explore</Button>)
    }

    return (
      <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Link href="#">
              <img height="90%" width="90%" src={ Logo } alt="Swagger UI"/>
            </Link>
            <form className="download-url-wrapper" onSubmit={formOnSubmit}>
              {control.map((el, i) => cloneElement(el, { key: i }))}
            </form>
            <div className="input">
              <ul className="generate-client-menu dropit">
                <li className="dropit-trigger"><a id="client" href="#" className="dropdown-trigger gen-btn">Generate Client ▾</a>
                  <ul id="menu" className="dropit-submenu" style={{ display: "none" }}>
                    <li><a href="swagger/clients/akka-scala">Akka Scala</a></li>
                    <li><a href="swagger/clients/android">Android</a></li>
                    <li><a href="swagger/clients/async-scala">Async Scala</a></li>
                    <li><a href="swagger/clients/clojure">Clojure</a></li>
                    <li><a href="swagger/clients/csharp">C#</a></li>
                    <li><a href="swagger/clients/CsharpDotNet2">C# .NET 2.0</a></li>
                    <li><a href="swagger/clients/dart">Dart</a></li>
                    <li><a href="swagger/clients/flash">Flash</a></li>
                    <li><a href="swagger/clients/go">Go</a></li>
                    <li><a href="swagger/clients/java">Java</a></li>
                    <li><a href="swagger/clients/javascript">Javascript</a></li>
                    <li><a href="swagger/clients/javascript-closure-angular">Javascript Closure Angular</a></li>
                    <li><a href="swagger/clients/jmeter">Jmeter</a></li>
                    <li><a href="swagger/clients/objc">Objective-C</a></li>
                    <li><a href="swagger/clients/perl">Perl</a></li>
                    <li><a href="swagger/clients/php">PHP</a></li>
                    <li><a href="swagger/clients/python">Python</a></li>
                    <li><a href="swagger/clients/qt5cpp">Qt 5 C++</a></li>
                    <li><a href="swagger/clients/ruby">Ruby</a></li>
                    <li><a href="swagger/clients/scala">Scala</a></li>
                    <li><a href="swagger/clients/swift">Swift</a></li>
                    <li><a href="swagger/clients/tizen">Tizen</a></li>
                    <li><a href="swagger/clients/typescript-angular">Typescript Angular</a></li>
                    <li><a href="swagger/clients/typescript-node">Typescript Node</a></li></ul></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired
}
