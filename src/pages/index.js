import React from "react"

import Select from 'react-select';
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import { addDays } from 'date-fns';
import {uk} from 'date-fns/esm/locale'

import "react-datepicker/dist/react-datepicker.css";

import Layout from "../components/layout"
import SEO from "../components/seo"

registerLocale('uk', uk);

const options = [
  { value: 'Монтаж кабеля в грунт', label: 'Монтаж кабеля в грунт' },
  { value: 'Монтаж пластикової труби в грунт', label: 'Монтаж пластикової труби в грунт' },
];

class IndexPage extends React.Component {
  constructor() {
    super();

    this.state = {
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
      { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)
    );
  };

  render() {

    return (
	  <Layout>
	    <SEO title="KTZ Company" />

	    <div className="first-screen">
	    	<div className="container">
	    		<form action="" className="orderform">
	    			<h3 className="orderform--title">Замовити онлайн</h3>
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
								name="date-from"
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
								name="date-to"
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

	    <div className="services services--1">
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
									<button className="button button--full">Замовити дзвінок</button>
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
									<button className="button button--full">Замовити дзвінок</button>
								</div>
							</div>
						</div>
					</div>
				</div>
	    	</div>
	    </div>

	    <div className="aboutus">
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

	  </Layout>
	)
  }
}

export default IndexPage
