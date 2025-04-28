import "./widgets.scss"
import data from '../data/data.json'


function widgetsComponent() {
    return (
      <div className="box-container">
        <div className="box box-1">
          <div className="items">
            <div className="item">
              <h3 className="border">{data.contact.title}</h3>
              <h4 className="contact">{data.contact.phone.label}</h4>
              <p>{data.contact.phone.value}</p>
              <h4 className="contact">{data.contact.email.label}</h4>
              <p>{data.contact.email.value}</p>
            </div>
            <div className="item">
              <h3 className="border">{data.headOffice.title}</h3>
              <p>{data.headOffice.street}</p>
              <p>{data.headOffice.ward}</p>
              <p>{data.headOffice.city}</p>
            </div>
            <div className="item">
              <h3 className="border">{data.openingHours.title}</h3>
              <p>{data.openingHours.open}</p>
              <p>{data.openingHours.sat}</p>
              <p>{data.openingHours.sun}</p>
            </div>
          </div>
        </div>
      </div>
    );
}
export default widgetsComponent