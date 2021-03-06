import React, { Component } from 'react';
import './lastProduct.css'

class LastProdInDB extends Component {
    constructor() {
        super();

        this.state = {
            lastProduct: {}
        };
    };

    componentDidMount() {

        fetch('http://localhost:3000/api/products')
            .then(response => response.json())
            .then(products => {
                this.setState({ lastProduct: products.meta.lastProduct });
            })
            .catch(err => console.log(err));
    };

    render() {
        return (
            <div className="col-lg-6 mb-4">
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary" id="last-product">Último producto en la base de datos</h6>
                    </div>
                    <div className="card-body">
                        <div className="text-center">
                            <h6 className="font-weight-bold">{this.state.lastProduct.name}</h6>
                            <img className="img-fluid px-3 px-sm-4 mt-3 mb-4" style={{ width: 25 + "rem" }} src={`http://localhost:3000${this.state.lastProduct.image}`} alt="last product" />
                        </div>
                        <p>{this.state.lastProduct.description_short}</p>
                        <a className="link" target="_blank" rel="nofollow" href={this.state.lastProduct.endpoint}>Ver detalle del Producto</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default LastProdInDB;