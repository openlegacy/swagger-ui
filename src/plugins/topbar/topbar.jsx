import React, { PropTypes } from "react"

//import "./topbar.less"
import Logo from "./logo_small.png"

export default class Topbar extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = { url: props.specSelectors.url() }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ url: nextProps.specSelectors.url() })
  }

  onUrlChange = (e) => {
    let { target: { value } } = e
    this.setState({ url: value })
  }

  downloadUrl = (e) => {
    this.props.specActions.updateUrl(this.state.url)
    this.props.specActions.download(this.state.url)
    e.preventDefault()
  }

  render() {
    let { getComponent, specSelectors } = this.props
    const Button = getComponent("Button")
    const Link = getComponent("Link")

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"

    let inputStyle = {}
    if (isFailed) inputStyle.color = "red"
    if (isLoading) inputStyle.color = "#aaa"
    return (
      <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Link href="#" title="Swagger UX">
              <img height="50" width="160" src={Logo} alt="Swagger UX" />
            </Link>
            <form className="download-url-wrapper" onSubmit={this.downloadUrl}>
              <input className="download-url-input" type="text" onChange={this.onUrlChange} value={this.state.url} disabled={isLoading} style={inputStyle} />
              <Button className="download-url-button" onClick={this.downloadUrl}>Explore</Button>
              {/*<button className="btn unlocked generate-client-menu dropit" style={{margin: "11px 0px 0px 10px"}}><span>Generate Clients</span></button>*/}
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
  getComponent: PropTypes.func.isRequired
}