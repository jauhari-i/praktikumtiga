import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const baseUrl = 'https://api-tugas.herokuapp.com/v1/praktikum/tiga';

const App = () => {
  const [pegawai, setPegawai] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}/pegawai`)
      .then((data) => {
        setPegawai(data.data.data.pegawai);
        setLoading(false);
      })
      .catch((err) => {
        setPegawai([]);
        setLoading(false);
      });
  }, [setLoading]);

  useEffect(() => {
    if (message === 'SUKSESEDIT' || message === 'SUKSESADD' || message === 'SUKSESDEL') {
      axios
        .get(`${baseUrl}/pegawai`)
        .then((data) => {
          setPegawai(data.data.data.pegawai);
          setMessage('');
          setSelected({});
          setLoading(false);
        })
        .catch((err) => {
          setPegawai([]);
          setMessage('');
          setSelected({});
          setLoading(false);
        });
    }
  }, [message]);

  return (
    <div>
      <h1
        style={{
          textAlign: 'center',
          marginTop: '1rem',
          textTransform: 'uppercase',
        }}
      >
        tugas praktikum tiga
      </h1>
      <p
        style={{
          textAlign: 'center',
          marginTop: '1rem',
          textTransform: 'uppercase',
        }}
      >
        Muhammad Irfan Jauhari
      </p>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <div className="container table-responsive py-5">
            <div className="row mb-3">
              <div className="col-md-9"></div>
              <div className="col-md-3">
                <button className="btn btn-primary" data-toggle="modal" data-target="#addModal">
                  Tambah Pegawai
                </button>
              </div>
            </div>
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">NIP</th>
                  <th scope="col">Nama</th>
                  <th scope="col">Alamat</th>
                  <th scope="col">Lainnya</th>
                </tr>
              </thead>
              <tbody>
                {pegawai.map((item, i) => (
                  <tr key={i + 'pegawai'}>
                    <th scope="row">{item.nip}</th>
                    <td>{item.nama}</td>
                    <td>{item.alamat}</td>
                    <td>
                      <div className="row">
                        <button
                          className="btn btn-sm btn-info ml-2 mx-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelected(item);
                          }}
                          data-toggle="modal"
                          data-target="#editModal"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger mx-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelected(item);
                          }}
                          data-toggle="modal"
                          data-target="#deleteModal"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <AddModal setMessage={setMessage} />
      <EditModal data={selected} setMessage={setMessage} />
      <DeleteModal data={selected} setMessage={setMessage} />
    </div>
  );
};

const EditModal = ({ data, setMessage }) => {
  const [nip, setNip] = useState('');
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [errCb, setErrCb] = useState('');

  useEffect(() => {
    setNip(data.nip);
    setNama(data.nama);
    setAlamat(data.alamat);
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingEdit(true);
    axios
      .put(`${baseUrl}/pegawai/${data.uuid}`, {
        nip: nip,
        nama: nama,
        alamat: alamat,
      })
      .then((data) => {
        setMessage('SUKSESEDIT');
        setIsLoadingEdit(false);
        window.jQuery(function () {
          window.jQuery('#editModal').modal('toggle');
        });
      })
      .catch((err) => {
        if (err.response.data.errors) {
          setErrCb(err.response.data.errors[0].msg);
        }
        setIsLoadingEdit(false);
      });
  };

  return (
    <div
      className="modal fade"
      id="editModal"
      tabIndex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editModalLabel">
              Edit Pegawai
            </h5>
            <button
              onClick={(e) => {
                e.preventDefault();
                setNip('');
                setNama('');
                setAlamat('');
                setErrCb('');
              }}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">NIP</label>
                <input
                  type="number"
                  className={!nip ? 'form-control is-invalid' : 'form-control'}
                  min="0"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  name="nip"
                  value={nip}
                  onChange={(e) => {
                    setNip(e.target.value);
                  }}
                  disabled
                />
                <div id="exampleInputEmail1Feedback" className="invalid-feedback">
                  NIP tidak boleh kosong
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail2">Nama</label>
                <input
                  type="text"
                  className={!nama ? 'form-control is-invalid' : 'form-control'}
                  id="exampleInputEmail2"
                  aria-describedby="emailHelp"
                  name="nama"
                  value={nama}
                  onChange={(e) => {
                    setNama(e.target.value);
                  }}
                />
                <div id="exampleInputEmail2Feedback" className="invalid-feedback">
                  Nama tidak boleh kosong
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Alamat</label>
                <input
                  type="text"
                  className={!alamat ? 'form-control is-invalid' : 'form-control'}
                  name="alamat"
                  value={alamat}
                  onChange={(e) => {
                    setAlamat(e.target.value);
                  }}
                  id="exampleInputPassword1"
                />
                <div id="exampleInputPassword1Feedback" className="invalid-feedback">
                  Alamat tidak boleh kosong
                </div>
              </div>
              {errCb ? <p className="text-danger">{errCb}</p> : ''}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">
                Batal
              </button>
              <button
                disabled={isLoadingEdit || !nip || !nama || !alamat}
                type="submit"
                className="btn btn-primary"
              >
                {isLoadingEdit ? 'Mengirim...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AddModal = ({ setMessage }) => {
  const [nip, setNip] = useState('');
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [submited, setSubmited] = useState(false);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [errCb, setErrCb] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmited(true);
    if (!nip && !nama && !alamat) {
      setSubmited(true);
    } else {
      setIsLoadingAdd(true);
      axios
        .post(`${baseUrl}/pegawai`, {
          nip: nip,
          nama: nama,
          alamat: alamat,
        })
        .then((data) => {
          setMessage('SUKSESEDIT');
          setIsLoadingAdd(false);
          setSubmited(false);
          setNip('');
          setNama('');
          setAlamat('');
          window.jQuery(function () {
            window.jQuery('#addModal').modal('toggle');
          });
        })
        .catch((err) => {
          if (err.response.data.errors) {
            setErrCb(err.response.data.errors[0].msg);
          }
          setIsLoadingAdd(false);
          setSubmited(false);
        });
    }
  };

  return (
    <div
      className="modal fade"
      id="addModal"
      tabIndex="-1"
      aria-labelledby="addModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addModalLabel">
              Edit Pegawai
            </h5>
            <button
              onClick={(e) => {
                e.preventDefault();
                setNip('');
                setNama('');
                setAlamat('');
                setErrCb('');
              }}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">NIP</label>
                <input
                  type="number"
                  min="0"
                  className={submited && !nip ? 'form-control is-invalid' : 'form-control'}
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  name="nip"
                  value={nip}
                  onChange={(e) => {
                    setNip(e.target.value);
                    setErrCb('');
                  }}
                />
                <div id="exampleInputEmail1Feedback" className="invalid-feedback">
                  NIP tidak boleh kosong
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail2">Nama</label>
                <input
                  type="text"
                  className={submited && !nama ? 'form-control is-invalid' : 'form-control'}
                  id="exampleInputEmail2"
                  aria-describedby="emailHelp"
                  name="nama"
                  value={nama}
                  onChange={(e) => {
                    setNama(e.target.value);
                    setErrCb('');
                  }}
                />
                <div id="exampleInputEmail2Feedback" className="invalid-feedback">
                  Nama tidak boleh kosong
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Alamat</label>
                <input
                  type="text"
                  className={submited && !alamat ? 'form-control is-invalid' : 'form-control'}
                  name="alamat"
                  value={alamat}
                  onChange={(e) => {
                    setAlamat(e.target.value);
                    setErrCb('');
                  }}
                  id="exampleInputPassword1"
                />
                <div id="exampleInputPassword1Feedback" className="invalid-feedback">
                  Alamat tidak boleh kosong
                </div>
              </div>
              {errCb ? <p className="text-danger">{errCb}</p> : ''}
            </div>
            <div className="modal-footer">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setNip('');
                  setNama('');
                  setAlamat('');
                  setErrCb('');
                }}
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Batal
              </button>
              <button disabled={isLoadingAdd} type="submit" className="btn btn-primary">
                {isLoadingAdd ? 'Mengirim...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ data, setMessage }) => {
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const deletePegawai = (e) => {
    e.preventDefault();
    setIsLoadingDelete(true);
    axios
      .delete(`${baseUrl}/pegawai/${data.uuid}`)
      .then((data) => {
        setMessage('SUKSESDEL');
        setIsLoadingDelete(false);
        window.jQuery(function () {
          window.jQuery('#deleteModal').modal('toggle');
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingDelete(false);
      });
  };

  return (
    <div
      className="modal fade"
      id="deleteModal"
      tabIndex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteModalLabel">
              Anda yakin ingin menghapus pegawai ini?
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">
              Tidak
            </button>
            <button onClick={deletePegawai} type="button" className="btn btn-primary">
              {isLoadingDelete ? 'Menghapus...' : 'Ya'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
