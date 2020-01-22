import React from "react"

import { IntlContextConsumer, changeLocale, FormattedMessage } from "gatsby-plugin-intl"

import { graphql } from "gatsby"

import { Link } from "react-scroll"

import Select from 'react-select';
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import { addDays } from 'date-fns';
import {uk, ru} from 'date-fns/esm/locale'
import "react-datepicker/dist/react-datepicker.css";

import { TelegramClient } from 'messaging-api-telegram';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import logo from "../images/logo.svg"

import Layout from "../components/layout"
import SEO from "../components/seo"

registerLocale('uk', uk);
registerLocale('ru', ru);

const options = {
	"uk" : [
		{ value: 'Монтаж кабеля в ґрунт', label: 'Монтаж кабеля в ґрунт' },
		{ value: 'Монтаж пластикової труби в ґрунт', label: 'Монтаж пластикової труби в ґрунт' },
	],
	"ru" : [
		{ value: 'Монтаж кабеля в почву', label: 'Монтаж кабеля в почву' },
		{ value: 'Монтаж пластиковой трубы в почву', label: 'Монтаж пластиковой трубы в почву' },
	]
};

const client = TelegramClient.connect(process.env.API_KEY);

const languageName = {
	uk: "Українська",
	ru: "Русский",
}

class IndexPage extends React.Component {
	constructor(props) {
		super(props);

		this.openChangeLang = this.openChangeLang.bind(this);
		this.handleName = this.handleName.bind(this);
		this.handlePhone = this.handlePhone.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.openPhoneCallback = this.openPhoneCallback.bind(this);
		this.handleCallbackName = this.handleCallbackName.bind(this);
		this.handleCallbackPhone = this.handleCallbackPhone.bind(this);
		this.handleCallbackSubmit = this.handleCallbackSubmit.bind(this);

		this.state = {
			name: '',
			callname: '',
			phone: '',
			callphone: '',
			startFromDate: null,
			startToDate: null,
			selectedOption: null,
			dropdownState: false,
		}
	}

	openChangeLang(e) {
		this.setState(prevState => ({
			dropdownState: !prevState.dropdownState
		}));
	}

	handleStartDate = date => {
		this.setState({
		  startFromDate: date
		});
	};

	handleEndDate = date => {
		this.setState({
		  startToDate: date
		});
	};

	handleSelectChange = selectedOption => {
		this.setState(
		  { selectedOption: selectedOption }
		);
	};

	handleName(e) {
		this.setState({name: e.target.value})
	}

	handlePhone(e) {
		this.setState({phone: e.target.value})
	}

	handleCallbackName(e) {
		this.setState({callname: e.target.value})
	}

	handleCallbackPhone(e) {
		this.setState({callphone: e.target.value})
	}

	handleSubmit(e) {
		e.preventDefault();

		const messageTextLang = this.props.pageContext.intl.messages;
		var messageText = messageTextLang.messageTextTitle, elements = e.target.elements;

		if(this.state.name && this.state.phone && this.state.selectedOption && this.state.startToDate && this.state.startFromDate) {
			messageText += messageTextLang.messageTextName + this.state.name + ' \n';
			messageText += messageTextLang.messageTextPhone + this.state.phone + ' \n';
			messageText += messageTextLang.messageTextService + elements.service.value + ' \n';
			messageText += messageTextLang.messageTextDateFrom + elements.date_from.value + ' \n';
			messageText += messageTextLang.messageTextDateTo + elements.date_to.value

			client.sendMessage(process.env.GROUP_ID, messageText, {
				parse_mode: 'HTML',
				disable_web_page_preview: true,
			});

			this.setState({
				name: '',
				phone: '',
				startFromDate: null,
				startToDate: null,
				selectedOption: null,
			});

			store.addNotification({
				title: messageTextLang.notifySuccessTitle,
				message: messageTextLang.notifySuccessText,
				type: "success",
				container: "top-center",
				animationIn: ["animated", "fadeIn"],
				animationOut: ["animated", "fadeOut"],
				width: 300,
				dismiss: {
					duration: 5000
				}
			});
		} else {
			store.addNotification({
				title: messageTextLang.notifyErrorTitle,
				message: messageTextLang.notifyErrorText,
				type: "danger",
				container: "top-center",
				animationIn: ["animated", "fadeIn"],
				animationOut: ["animated", "fadeOut"],
				width: 300,
				dismiss: {
					duration: 5000
				}
			});
		}
	}

	openPhoneCallback() {

		const placeholdersLang = this.props.pageContext.intl.messages;
		store.addNotification({
			id: "phoneCall",
			width: 300,
			container: "bottom-center",
			content: () => (
				<div className="callback--container">
					<button type="button" className="callback--close" onClick={() => {store.removeNotification("phoneCall")}}></button>
					<form className="callback--form" onSubmit={this.handleCallbackSubmit}>
						<div className="callback--row">
							<input type="text" name="name" placeholder={placeholdersLang.phoneCallName} onChange={this.handleCallbackName} value={this.state.callname} required />
						</div>
						<div className="callback--row">
							<input type="tel" name="phone" pattern="^[0-9-+\s()]*$" placeholder={placeholdersLang.phoneCallPhone} onChange={this.handleCallbackPhone} value={this.state.callphone} required />
						</div>
						<div className="callback--row">
							<input className="button button--full" type="submit" value={placeholdersLang.phoneCallSubmit} />
						</div>
					</form>
				</div>
			),
			animationIn: ["animated", "fadeIn"],
			animationOut: ["animated", "fadeOut"],
			dismiss: {
				duration: 0,
				click: false,
				touch: false
			}
		});
	}

	handleCallbackSubmit(e) {
		e.preventDefault();
		store.removeNotification("phoneCall");

		const messageTextLang = this.props.pageContext.intl.messages;

		var messageText = messageTextLang.messageTextTitle2;
		messageText += messageTextLang.messageTextName + this.state.callname + ' \n';
		messageText += messageTextLang.messageTextPhone + this.state.callphone;

		client.sendMessage(process.env.GROUP_ID, messageText, {
			parse_mode: 'HTML',
			disable_web_page_preview: true,
		});

		this.setState({
			callname: '',
			callphone: '',
		});

		store.addNotification({
			title: messageTextLang.notifySuccessTitle,
			message: messageTextLang.notifySuccessText,
			type: "success",
			container: "top-center",
			animationIn: ["animated", "fadeIn"],
			animationOut: ["animated", "fadeOut"],
			width: 300,
			dismiss: {
				duration: 5000
			}
		});
	}

	render() {

		const info = this.props.data;
		const intl = this.props.pageContext.intl;

		return (
		  <Layout>
			<SEO lang={intl.language} title={intl.messages.title} description={intl.messages.description} />

			<header className="header">
				<div className="container">
					<div className="header--container">
						<Link to="first" className="static" spy={true} smooth={true} duration={500}><img src={logo} alt={info.site.siteMetadata.title} /></Link>
						<div className="header--nav">
							<input id="header--nav__toggle" type="checkbox"/>
							<label htmlFor="header--nav__toggle" className="header--nav__toggle">
								<span /><span /><span />
							</label>
							<ul>
								<li><Link activeClass="active" to="services" spy={true} smooth={true} duration={500} ><FormattedMessage id="service" /></Link></li>
								<li><Link activeClass="active" to="aboutus" spy={true} smooth={true} duration={500} ><FormattedMessage id="aboutus" /></Link></li>
								<li><Link activeClass="active" to="contacts" spy={true} smooth={true} duration={500} ><FormattedMessage id="contacts" /></Link></li>
								<li>
									<button className={`lang--button lang--button__` + intl.language + (this.state.dropdownState?` open`:``)} onClick={() => this.openChangeLang()} title={languageName[intl.language]}><span className="flag"/></button>
									<ul className={`lang--dropdown ` + (this.state.dropdownState?`open`:``)}>
										<IntlContextConsumer>
											{({ languages, language: currentLocale }) => 
											  languages.map(language => (
											    <li key={language} className={`lang--li` + (currentLocale === language ? ` selected` : ``)}>
											    	<button onClick={() => changeLocale(language)} className={`lang--button lang--button__` + language + (currentLocale === language ? ` selected` : ``)} title={languageName[language]}>
											    		<span className="flag"/>
											    	</button>
											    </li>
											  ))
											}
										</IntlContextConsumer>
									</ul>
								</li>
								<li><button className="button button--full" onClick={() => {this.openPhoneCallback()}}><FormattedMessage id="getCall" /></button></li>
							</ul>
						</div>
					</div>
				</div>
			</header>

			<main>
				<div id="first" className="first-screen">
					<div className="container">
						<div className="col-sm-6">
							<h1><FormattedMessage id="h1" /> <span><FormattedMessage id="h1Span" /></span></h1>
						</div>
						<div className="col-sm-6">
							<form className="orderform" onSubmit={this.handleSubmit}>
								<h3 className="orderform--title"><FormattedMessage id="orderformTitle" /></h3>
								<div className="orderform--name">
									<input type="text" name="name" placeholder={intl.messages.orderformName} onChange={this.handleName} value={this.state.name} required />
								</div>
								<div className="orderform--phone">
									<input type="tel" name="phone" pattern="^[0-9-+\s()]*$" placeholder={intl.messages.orderformPhone} onChange={this.handlePhone} value={this.state.phone} required />
								</div>
								<div className="orderform--select">
									<Select
										name="service"
										required={true}
										placeholder={intl.messages.orderformService}
										clearable={false}
										searchable={false}
										value={this.state.selectedOption}
										onChange={this.handleSelectChange}
										options={options[intl.language]}
									/>
								</div>
								<div className="orderform--date">
									<div className="orderform--date__from">
										<DatePicker
											name="date_from"
											autoComplete="off"
											required={true}
											calendarClassName="orderform--calendar"
											selected={this.state.startFromDate}
											selectsStart
											placeholderText={intl.messages.orderformDateFrom}
											onChange={this.handleStartDate}
											startDate={this.state.startFromDate}
											endDate={this.state.startToDate}
											minDate={new Date()}
											maxDate={this.state.startToDate?this.state.startToDate:null}
											dateFormat="dd.MM.yyyy"
											locale={intl.language}
										/>

									</div>
									<div className="orderform--date__to">
										<DatePicker
											name="date_to"
											autoComplete="off"
											required={true}
											calendarClassName="orderform--calendar"
											selected={this.state.startToDate}
											selectsEnd
											placeholderText={intl.messages.orderformDateTo}
											onChange={this.handleEndDate}
											startDate={this.state.startFromDate}
											endDate={this.state.startToDate}
											minDate={this.state.startFromDate?addDays(this.state.startFromDate, 1):addDays(new Date(), 1)}
											dateFormat="dd.MM.yyyy"
											locale={intl.language}
										/>
									</div>
								</div>
								<div className="orderform--button">
									<input className="button button--full" type="submit" value={intl.messages.phoneCallSubmit} />
								</div>
							</form>
						</div>

					</div>
				</div>

				<div id="services" className="services services--1">
					<div className="container">
						<div className="services--container">
							<div className="services--1-right">
								<div className="services--1-img"></div>
							</div>
							<div className="services--1-left">
								<div className="services--content">
									<div className="services--content__category"><FormattedMessage id="service" /></div>
									<h2 className="services--content__title"><FormattedMessage id="servicesName1" /></h2>
									<div className="services--content__text" dangerouslySetInnerHTML={{ __html: intl.messages.servicesBody1}} />
									<div className="services--content__info">
										<div className="services--content__info-price"><FormattedMessage id="servicesPriceName" /> <span><FormattedMessage id="servicesPriceValue" /></span></div>
										<div className="services--content__info-callback">
											<button className="button button--full" onClick={() => {this.openPhoneCallback()}}><FormattedMessage id="getCall" /></button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="services services--2">
					<div className="container">
						<div className="services--container">
							<div className="services--2-left">
								<div className="services--2-img"></div>
							</div>
							<div className="services--2-right">
								<div className="services--content">
									<div className="services--content__category"><FormattedMessage id="service" /></div>
									<h2 className="services--content__title"><FormattedMessage id="servicesName2" /> <span><FormattedMessage id="servicesNameSub2" /></span></h2>
									<div className="services--content__text" dangerouslySetInnerHTML={{ __html: intl.messages.servicesBody2}} />
									<div className="services--content__info">
										<div className="services--content__info-price"><FormattedMessage id="servicesPriceName" /> <span><FormattedMessage id="servicesPriceValue" /></span></div>
										<div className="services--content__info-callback">
											<button className="button button--full" onClick={() => {this.openPhoneCallback()}}><FormattedMessage id="getCall" /></button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id="aboutus" className="aboutus">
					<div className="container">
						<div className="aboutus--title" data-backtitle={intl.messages.aboutus}><FormattedMessage id="aboutus" /></div>
						<div className="aboutus--container">
							<div className="aboutus--left">
								<div className="aboutus--img"></div>
							</div>
							<div className="aboutus--right">
								<div className="aboutus--text" dangerouslySetInnerHTML={{ __html: intl.messages.aboutusBody}} />
								<div className="aboutus--signature">Колектив KTZ Company</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<footer id="contacts" className="footer">
				<div className="footer--contacts">
				  <div className="container">
					<div className="footer--container">
					  <Link to="first" className="static" spy={true} smooth={true} duration={500}><img src={logo} alt={info.site.siteMetadata.title} /></Link>
					  <a href="tel:+380973295976" className="footer--phone">+380 97 329 5976</a>
					</div>
				  </div>
				</div>
				<div className="footer--copyright">
				  <div className="container">
					<div className="footer--copyright__text">
					  © {new Date().getFullYear()}
					  {` `}
					  {info.site.siteMetadata.title}
					</div>
				  </div>
				</div>
			</footer>

		  </Layout>
		)
	}
}

export default IndexPage

export const pageQuery = graphql`
  query siteTitleQueryAndSiteTitleQuery {
	site {
	  siteMetadata {
		title
	  }
	}
  }
`