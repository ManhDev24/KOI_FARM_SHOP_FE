import { Breadcrumb, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Form as AntForm } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthApi } from '../../apis/Auth.api';



// Yup schema để xác thực dữ liệu
const schema = yup.object().shape({
  fullName: yup.string()
    .required('Vui lòng nhập họ và tên')
    .min(3, 'Tên quá ngắn!')
    .matches(/^[A-Za-zÀ-ỹ\s]+$/, 'Họ và tên không được chứa số hoặc ký tự đặc biệt'),

  email: yup.string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),

  password: yup.string()
    .required('Vui lòng nhập mật khẩu cũ'),

  newPassword: yup.string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt')
    .notOneOf([yup.ref('password')], 'Mật khẩu mới không được giống mật khẩu cũ'),

  confirmPassword: yup.string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([yup.ref('newPassword')], 'Xác nhận mật khẩu không khớp'),

  address: yup.string()
    .required('Vui lòng nhập địa chỉ')
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),

  phone: yup.string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ chứa số')
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .max(15, 'Số điện thoại không được vượt quá 15 chữ số'),

});

const Profile = () => {

  const { control, trigger, formState: { errors }, getValues, setValue, setError, clearErrors, } = useForm({
    resolver: yupResolver(schema),
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [success, setSuccess] = useState('');
  const [initialData, setInitialData] = useState({
    fullName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    avatar: '',
  });

  const [isEditing, setIsEditing] = useState({
    fullName: false,
    email: false,
    password: false,
    address: false,
    phone: false,
    avatar: false,
  });

  const [oldPasswordCorrect, setOldPasswordCorrect] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const dataProfile = JSON.parse(localStorage.getItem('user'));
        if (dataProfile && dataProfile.email) {
          const profile = await AuthApi.userProfile(dataProfile.email);
          const profileData = profile.data;

          setInitialData({
            fullName: profileData.fullName || '',
            email: profileData.email || '',
            password: profileData.password || '',
            address: profileData.address || '',
            phone: profileData.phone || '',
            avatar: profileData.avatar || './img/avatar.svg',
          });
          setAvatarPreview(profileData.avatar || './img/avatar.svg');

          setValue('fullName', profileData.fullName);
          setValue('email', profileData.email);
          setValue('address', profileData.address);
          setValue('phone', profileData.phone);
          setValue('avatar', profileData.avatar);
        } else {
          message.error('Không tìm thấy email người dùng. Vui lòng đăng nhập lại.');
        }
      } catch (error) {
        message.error('Lỗi khi tải dữ liệu hồ sơ. Vui lòng thử lại sau.');
      }
    };

    fetchProfile();
  }, [setValue]);
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatar || './img/avatar.svg');
  const handleSaveField = async (field) => {
    const isValid = await trigger(field);
    if (!isValid) return;

    const value = getValues(field);
    let updatedData = {};


    if (field === 'fullName') {
      updatedData = { fullName: value };

    } else {
      updatedData = { [field]: value };
    }

    try {
      const dataProfile = JSON.parse(localStorage.getItem('user'));
      const id = dataProfile.id;
      const accessToken = dataProfile.accessToken;


      const completeUpdatedData = {
        fullName: field === 'fullName' ? value : initialData.fullName,
        email: initialData.email,
        password: initialData.password,
        address: field === 'address' ? value : initialData.address,
        phone: field === 'phone' ? value : initialData.phone,
        avatar: field === 'avatar' ? value : initialData.avatar,
      };

      await AuthApi.userProfileEdit(id, accessToken, completeUpdatedData);


      setInitialData((prevData) => ({
        ...prevData,
        [field]: value,

      }));

      setIsEditing((prevState) => ({
        ...prevState,
        [field]: false,
      }));

      message.success(`${field} đã được cập nhật thành công`);
    } catch (error) {
      message.error(`Lỗi khi cập nhật ${field}: ${error.message}`);
    }
  };


  const [selectedFile, setSelectedFile] = useState(null);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        message.error('Định dạng file không hợp lệ. Chỉ chấp nhận JPEG hoặc PNG.');
        return;
      }

      if (file.size > 20000000) {
        message.error('File quá lớn. Kích thước tối đa là 20MB.');
        return;
      }


      setSelectedFile(file);
      console.log(file)
      setAvatarPreview(URL.createObjectURL(file));


      handleAvatarUpload(file);
      e.target.value = '';
    }
  };


  const handleAvatarUpload = async (file) => {

    const formData = new FormData();
    formData.append('file', file);

    try {

      const dataProfile = JSON.parse(localStorage.getItem('user'));
      const id = dataProfile?.id;

      if (!id) {
        message.error('Không tìm thấy thông tin người dùng.');
        return;
      }


      const response = await fetch(`http://localhost:8080/koifarm/account/profile/updateAvatar/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi upload ảnh.');
      }

      const data = await response.json();
      message.success('Upload ảnh thành công!');

      console.log(data);

    } catch (error) {

      message.error(error.message || 'Đã xảy ra lỗi khi upload ảnh, vui lòng thử lại.');
    }
  };


  const handleOldPasswordSubmit = async () => {
    try {


      const oldPassword = getValues('password');
      const dataProfile = JSON.parse(localStorage.getItem('user'));
      const id = dataProfile.id;

      const response = await AuthApi.checkPassword(id, oldPassword);


      if (response.data) {
        setOldPasswordCorrect(true);
        clearErrors('password');

      } else {
        setError('password', {
          type: 'manual',
          message: 'Mật khẩu cũ không chính xác',
        });

        setOldPasswordCorrect(false);

      }
    } catch (error) {
      setError('password', {
        type: 'manual',
        message: error.message || 'Lỗi xác thực mật khẩu',
      });
      setOldPasswordCorrect(false);
    }
  };


  const handleSavePassword = async () => {
    const isValidNewPassword = await trigger('newPassword');
    const isValidConfirmPassword = await trigger('confirmPassword');

    if (isValidNewPassword && isValidConfirmPassword) {
      const newPassword = getValues('newPassword');

      try {
        const dataProfile = JSON.parse(localStorage.getItem('user'));
        const id = dataProfile.id;
        const accessToken = dataProfile.accessToken;

        await AuthApi.updatePassword(id, accessToken, newPassword);

        setInitialData((prevData) => ({
          ...prevData,
          password: newPassword,
        }));

        setPasswordChanged(true);
        setOldPasswordCorrect(false);
        setIsEditing((prevState) => ({
          ...prevState,
          password: false,
        }));

        message.success('Mật khẩu đã được cập nhật thành công');
      } catch (error) {
        message.error('Lỗi khi cập nhật mật khẩu: ' + error.message);
      }
    }
  };



  const handleCancel = (field) => {
    if (field === 'password') {
      setOldPasswordCorrect(false);
    }
    setValue('', initialData[field]);
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };



  const renderFormItem = (label, fieldName, placeholder, isPassword = false) => {

    if (fieldName === 'email') {
      return (
        <AntForm.Item label={label} className='flex'>
          <div className="text-black flex flex-col text-xl font-['Arial'] w-full">{initialData[fieldName]}</div>
        </AntForm.Item>
      );
    }



    return (
      <AntForm.Item className='flex'
        label={label}
        validateStatus={errors[fieldName] ? 'error' : ''}
        help={errors[fieldName]?.message}
      >
        {initialData[fieldName]}
        {isEditing[fieldName] ? (
          <>

            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                isPassword ? (
                  <Input.Password
                    {...field}

                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                ) : (
                  <Input {...field} />
                )
              )}
            />
            <Button
              type="primary"
              onClick={() => handleSaveField(fieldName)}
            >
              Lưu thay đổi
            </Button>
            <Button onClick={() => handleCancel(fieldName)}>Hủy</Button>
          </>
        ) : (
          <>
            <div className="text-black  text-xl inline font-['Arial']"></div>
            <Button type="link" onClick={() => setIsEditing((prevState) => ({
              ...prevState,
              [fieldName]: true
            }))}>
              Chỉnh sửa
            </Button>
          </>
        )}
      </AntForm.Item>
    );
  };


  return (
    <>
      <div className="w-full">
        <div className="w-[950px] mx-auto my-0">
          <Breadcrumb separator=">" className="flex items-center font-bold text-lg m-3">
            <Breadcrumb.Item>
              <Link to="/" style={{ color: "#EA4444" }}>
                Trang chủ
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link style={{ color: "#EA4444" }}>
                Thông tin cá nhân
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="w-[1250px] h-[712px] pl-[37px] pr-14 py-[71px] shadow flex justify-center items-center col-span-2">
          <div className="w-full h-full flex flex-col items-end pt-[15px] rounded-[10px]">
            <div className="w-full h-[50px]">
              <div className="text-black text-2xl h-[50px] flex items-center font-['Arial'] ps-2 shadow">
                Ảnh Đại Diện
              </div>
            </div>
            <div className="w-full h-[315px] bg-white shadow flex justify-center items-center">
              <div className="flex flex-col">
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="inline-block h-[200px] w-[200px] rounded-full ring-2 ring-lime-100"
                />
                <div className="file-input-wrapped flex justify-center items-center mt-4">
                  <input
                    type="file"
                    id="file-input"
                    name="avatar"
                    accept="image/jpeg,image/png"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-input"
                    className="upload-button flex justify-center items-center px-2 rounded-[10px] bg-[#FFFFFF] border-2 border-[#FA4444] cursor-pointer"
                  >
                    <p>Cập nhật ảnh đại diện</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin cá nhân */}
          <div className="w-[699px] h-[570px] ms-10 mt-[30px] relative flex-col flex shadow">
            <div className="w-[654px]">
              <div className="text-black text-2xl h-[50px] flex items-center w-full ms-2 font-['Arial']">
                Thông tin cá nhân
              </div>
            </div>
            <AntForm className=' ms-10' >
              {/* Họ và tên */}
              {renderFormItem('Họ và tên', 'fullName', 'Nhập họ và tên')}

              {/* Email */}
              {renderFormItem('Email', 'email', 'Nhập email')}

              {/* Mật khẩu */}
              <AntForm.Item label="Mật khẩu" validateStatus={errors.password ? 'error' : ''} help={((errors.password?.message) === 'Nhập lại pass word') ? "Sai mật khẩu vui lòng thử lại!" : ' '}>

                {initialData.password === '' ? (
                  <div className="text-black text-xl font-['Arial']">
                    Tài khoản đăng nhập bằng Google
                  </div>
                ) : (
                  <>
                    {!isEditing.password ? (
                      <Button type="link" onClick={() => setIsEditing((prevState) => ({ ...prevState, password: true }))}>
                        Chỉnh sửa mật khẩu
                      </Button>
                    ) : !oldPasswordCorrect ? (
                      <>
                        {!passwordChanged ? (
                          <>
                            <Controller
                              name="password"
                              control={control}
                              render={({ field }) => (
                                <Input.Password
                                  {...field}
                                  placeholder="Nhập mật khẩu cũ"
                                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />

                              )} onChange={(e) => {
                                field.onChange(e);
                                clearErrors('password'); // Xóa lỗi khi người dùng nhập
                              }}

                            />
                            <Button
                              type="primary"
                              onClick={() => {
                                handleOldPasswordSubmit();
                                setValue('password', '');
                                setValue('newPassword', null);   // Reset trường newPassword
                                setValue('confirmPassword', null);  // Reset trường confirmPassword
                              }}>
                              Xác nhận mật khẩu cũ
                            </Button>

                            <Button onClick={() => handleCancel('password')}>Hủy</Button>
                          </>
                        ) : (
                          <Button type="link" onClick={() => setPasswordChanged(false)}>
                            Đổi mật khẩu
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <AntForm.Item
                          label="Mật khẩu mới"
                          validateStatus={errors.newPassword ? 'error' : ''}
                          help={errors.newPassword?.message}
                        >
                          <Controller
                            name="newPassword"
                            control={control}
                            render={({ field }) => (
                              <Input.Password
                                {...field}
                                placeholder="Nhập mật khẩu mới"
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                              />
                            )}
                          />
                        </AntForm.Item>

                        <AntForm.Item
                          label="Xác nhận mật khẩu mới"
                          validateStatus={errors.confirmPassword ? 'error' : ''}
                          help={errors.confirmPassword?.message}
                        >
                          <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                              <Input.Password
                                {...field}
                                placeholder="Xác nhận mật khẩu mới"
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                              />
                            )}
                          />
                        </AntForm.Item>

                        <Button type="primary" onClick={() => {

                          handleSavePassword();
                        }}>Lưu thay đổi</Button>

                        <Button onClick={() => handleCancel('password')}>Hủy</Button>
                      </>
                    )}
                  </>
                )}
              </AntForm.Item>


              {/* Địa chỉ */}
              {renderFormItem('Địa chỉ', 'address', 'Nhập địa chỉ')}

              {/* Số điện thoại */}
              {renderFormItem('Số điện thoại', 'phone', 'Nhập số điện thoại')}
            </AntForm>
          </div>
        </div>
      </div >
    </>
  );
};

export default Profile;
