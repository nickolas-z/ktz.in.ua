import React from "react"

import { graphql } from "gatsby"

import { Link } from "react-scroll"

import Select from 'react-select';
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import { addDays } from 'date-fns';
import {uk} from 'date-fns/esm/locale'
import "react-datepicker/dist/react-datepicker.css";

import { TelegramClient } from 'messaging-api-telegram';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import logo from "../images/logo.svg"

import Layout from "../components/layout"
import SEO from "../components/seo"

registerLocale('uk', uk);

const options = [
  { value: 'Монтаж кабеля в грунт', label: 'Монтаж кабеля в грунт' },
  { value: 'Монтаж пластикової труби в грунт', label: 'Монтаж пластикової труби в грунт' },
];

const client = TelegramClient.connect(process.env.API_KEY);

class IndexPage extends React.Component {
	constructor(props) {
		super(props);

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
		}
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

		var messageText = "<b>Нове замовлення</b> \n===================\n", elements = e.target.elements;

		if(this.state.name && this.state.phone && this.state.selectedOption && this.state.startToDate && this.state.startFromDate) {
			messageText += '<b>Ім\'я:</b> ' + this.state.name + ' \n';
			messageText += '<b>Телефон:</b> ' + this.state.phone + ' \n';
			messageText += '<b>Послуга:</b> ' + elements.service.value + ' \n';
			messageText += '<b>Від:</b> ' + elements.date_from.value + ' \n';
			messageText += '<b>До:</b> ' + elements.date_to.value

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
				title: "Успіх!",
				message: "Дякуємо, що залишили заявку! Скоро наш менеджер зв'яжеться з Вами.",
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
				title: "Помилка!",
				message: "Заповніть, будь ласка, усі поля!",
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
		store.addNotification({
			id: "phoneCall",
			width: 300,
			container: "bottom-center",
			content: () => (
				<div className="callback--container">
					<button type="button" className="callback--close" onClick={() => {store.removeNotification("phoneCall")}}></button>
					<form className="callback--form" onSubmit={this.handleCallbackSubmit}>
						<div className="callback--row">
							<input type="text" name="name" placeholder="Введіть ваше ім'я" onChange={this.handleCallbackName} value={this.state.callname} required />
						</div>
						<div className="callback--row">
							<input type="tel" name="phone" pattern="^[0-9-+\s()]*$" placeholder="Введіть ваш телефон" onChange={this.handleCallbackPhone} value={this.state.callphone} required />
						</div>
						<div className="callback--row">
							<input className="button button--full" type="submit" value="Замовити"/>
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

		var messageText = "<b>Замовлення на дзвінок</b> \n==================================\n";
		messageText += '<b>Ім\'я:</b> ' + this.state.callname + ' \n';
		messageText += '<b>Телефон:</b> ' + this.state.callphone;

		client.sendMessage(process.env.GROUP_ID, messageText, {
			parse_mode: 'HTML',
			disable_web_page_preview: true,
		});

		this.setState({
			callname: '',
			callphone: '',
		});

		store.addNotification({
			title: "Успіх!",
			message: "Дякуємо, що залишили заявку! Скоро наш менеджер зв'яжеться з Вами.",
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

		return (
		  <Layout>
			<SEO title="KTZ Company" />

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
								<li><Link activeClass="active" to="services" spy={true} smooth={true} duration={500} >Послуги</Link></li>
								<li><Link activeClass="active" to="aboutus" spy={true} smooth={true} duration={500} >Про нас</Link></li>
								<li><Link activeClass="active" to="contacts" spy={true} smooth={true} duration={500} >Контакти</Link></li>
								<li><button className="button button--full" onClick={() => {this.openPhoneCallback()}}>Замовити дзвінок</button></li>
							</ul>
						</div>
					</div>
				</div>
			</header>

			<main>
				<div id="first" className="first-screen">
					<div className="container">
						<form className="orderform" onSubmit={this.handleSubmit}>
							<h3 className="orderform--title">Замовити онлайн</h3>
							<div className="orderform--name">
								<input type="text" name="name" placeholder="Введіть ваше ім'я" onChange={this.handleName} value={this.state.name} required />
							</div>
							<div className="orderform--phone">
								<input type="tel" name="phone" pattern="^[0-9-+\s()]*$" placeholder="Введіть ваш телефон" onChange={this.handlePhone} value={this.state.phone} required />
							</div>
							<div className="orderform--select">
								<Select
									name="service"
									required={true}
									placeholder="Оберіть послугу"
									clearable={false}
									searchable={false}
									value={this.state.selectedOption}
									onChange={this.handleSelectChange}
									options={options}
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
										placeholderText="Від (дд.мм.рррр)"
										onChange={this.handleStartDate}
										startDate={this.state.startFromDate}
										endDate={this.state.startToDate}
										minDate={new Date()}
										maxDate={this.state.startToDate?this.state.startToDate:null}
										dateFormat="dd.MM.yyyy"
										locale="uk"
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
										placeholderText="До (дд.мм.рррр)"
										onChange={this.handleEndDate}
										startDate={this.state.startFromDate}
										endDate={this.state.startToDate}
										minDate={this.state.startFromDate?addDays(this.state.startFromDate, 1):addDays(new Date(), 1)}
										dateFormat="dd.MM.yyyy"
										locale="uk"
									/>
								</div>
							</div>
							<div className="orderform--button">
								<input className="button button--full" type="submit" value="Замовити"/>
							</div>
						</form>
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
									<div className="services--content__category">Послуги</div>
									<h2 className="services--content__title">Монтаж кабеля в грунт</h2>
									<div className="services--content__text">Lorem Ipsum - це текст-"риба", що використовується в друкарстві та дизайні. Lorem Ipsum є, фактично, стандартною "рибою" аж з XVI сторіччя, коли невідомий друкар взяв шрифтову гранку та склав на ній підбірку зразків шрифтів. "Риба" не тільки успішно пережила п'ять століть, але й прижилася в електронному верстуванні, залишаючись по суті незмінною. Вона популяризувалась в 60-их роках минулого сторіччя завдяки виданню зразків шрифтів Letraset, які містили уривки з Lorem Ipsum, і вдруге - нещодавно завдяки програмам комп'ютерного верстування на кшталт Aldus Pagemaker, які використовували різні версії Lorem Ipsum.</div>
									<div className="services--content__info">
										<div className="services--content__info-price">Ціна: <span>1000 грн/м<sup>2</sup></span></div>
										<div className="services--content__info-callback">
											<button className="button button--full" onClick={() => {this.openPhoneCallback()}}>Замовити дзвінок</button>
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
									<div className="services--content__category">Послуги</div>
									<h2 className="services--content__title">Монтаж пластикової труби в грунт <span>(діаметр до 40 мм)</span></h2>
									<div className="services--content__text">Lorem Ipsum - це текст-"риба", що використовується в друкарстві та дизайні. Lorem Ipsum є, фактично, стандартною "рибою" аж з XVI сторіччя, коли невідомий друкар взяв шрифтову гранку та склав на ній підбірку зразків шрифтів. "Риба" не тільки успішно пережила п'ять століть, але й прижилася в електронному верстуванні, залишаючись по суті незмінною. Вона популяризувалась в 60-их роках минулого сторіччя завдяки виданню зразків шрифтів Letraset, які містили уривки з Lorem Ipsum, і вдруге - нещодавно завдяки програмам комп'ютерного верстування на кшталт Aldus Pagemaker, які використовували різні версії Lorem Ipsum.</div>
									<div className="services--content__info">
										<div className="services--content__info-price">Ціна: <span>1000 грн/м<sup>2</sup></span></div>
										<div className="services--content__info-callback">
											<button className="button button--full" onClick={() => {this.openPhoneCallback()}}>Замовити дзвінок</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id="aboutus" className="aboutus">
					<div className="container">
						<div className="aboutus--title" data-backtitle="Про нас">Про нас</div>
						<div className="aboutus--container">
							<div className="aboutus--left">
								<div className="aboutus--img"></div>
							</div>
							<div className="aboutus--right">
								<div className="aboutus--text">Lorem Ipsum - це текст-"риба", що використовується в друкарстві та дизайні. Lorem Ipsum є, фактично, стандартною "рибою" аж з XVI сторіччя, коли невідомий друкар взяв шрифтову гранку та склав на ній підбірку зразків шрифтів. "Риба" не тільки успішно пережила п'ять століть, але й прижилася в електронному верстуванні, залишаючись по суті незмінною. Вона популяризувалась в 60-их роках минулого сторіччя завдяки виданню зразків шрифтів Letraset, які містили уривки з Lorem Ipsum, і вдруге - нещодавно завдяки програмам комп'ютерного верстування на кшталт Aldus Pagemaker, які використовували різні версії Lorem Ipsum.</div>
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