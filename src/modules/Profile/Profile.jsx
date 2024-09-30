import { Breadcrumb, Button } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avt from '/img/uploadavt.png';
import { Input, Form as AntForm } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthApi } from '../../apis/Auth.api';

// Yup schema để xác thực dữ liệu
const schema = yup.object().shape({
  name: yup.string()
    .required('Vui lòng nhập họ và tên') // Bắt buộc nhập
    .min(3, 'Tên quá ngắn!') // Tên phải có ít nhất 3 ký tự
    .matches(/^[A-Za-zÀ-ỹ\s]+$/, 'Họ và tên không được chứa số hoặc ký tự đặc biệt'), // Không chứa số và ký tự đặc biệt

  email: yup.string()
    .required('Vui lòng nhập email') // Bắt buộc nhập
    .email('Email không hợp lệ'), // Kiểm tra định dạng email

  // Validate mật khẩu cũ
  password: yup.string()
    .required('Vui lòng nhập mật khẩu cũ'), // Bắt buộc nhập mật khẩu cũ

  // Validate mật khẩu mới
  newPassword: yup.string()
    .required('Vui lòng nhập mật khẩu mới') // Bắt buộc nhập
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự') // Mật khẩu mới phải có ít nhất 8 ký tự
    .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái in hoa')
    .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái thường')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt')
    .notOneOf([yup.ref('password')], 'Mật khẩu mới không được giống mật khẩu cũ'),

  // Xác nhận mật khẩu mới
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
  // const profileData = () => {
  //   const respond = AuthApi.
  // }
  const { control, handleSubmit, trigger, formState: { errors }, getValues, setValue, setError } = useForm({
    resolver: yupResolver(schema),
  });
  
  const [initialData, setInitialData] = useState({
    name: 'Hoàng Tiến Đạt',
    email: 'dathtse170150@fpt.edu.vn',
    password: 'password123', // Mật khẩu cũ ban đầu (dữ liệu đã lưu)
    address: '299, Tên lửa, Bình Trị Đông B, Bình Tân, TP. Hồ Chí Minh',
    phone: '098*****13',
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false,
    address: false,
    phone: false,
  });

  const [oldPasswordCorrect, setOldPasswordCorrect] = useState(false); // Trạng thái kiểm tra mật khẩu cũ
  const [requireOldPasswordAgain, setRequireOldPasswordAgain] = useState(false); // Trạng thái yêu cầu nhập lại mật khẩu cũ
  const [passwordChanged, setPasswordChanged] = useState(false);
  // Hàm này sẽ được gọi khi submit form và lưu thông tin
  const handleSave = async (field) => {
    // Chỉ validate trường hiện tại
    const isValid = await trigger(field); // Kích hoạt validate cho trường đang chỉnh sửa

    if (isValid) {
      const value = getValues(field);
      setInitialData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
      setIsEditing((prevState) => ({
        ...prevState,
        [field]: false,
      }));
      setValue(field, value);
    }
  };

  const handleCancel = (field) => {
    setValue(field, initialData[field]);
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };

  // Kiểm tra mật khẩu cũ trước khi đổi mật khẩu
  const handleOldPasswordSubmit = () => {
    const oldPassword = getValues('password');
    if (oldPassword === initialData.password) {
      setOldPasswordCorrect(true); // Cho phép hiển thị form nhập mật khẩu mới
    } else {
      setError('password', {
        type: 'manual',
        message: 'Mật khẩu cũ không chính xác',
      });
      setOldPasswordCorrect(false);
    }
  };
  // Sau khi người dùng lưu mật khẩu mới thành công
  const handleSavePassword = async () => {
    const isValidNewPassword = await trigger('newPassword'); // Kiểm tra tính hợp lệ của mật khẩu mới
    const isValidConfirmPassword = await trigger('confirmPassword'); // Kiểm tra tính hợp lệ của xác nhận mật khẩu

    if (isValidNewPassword && isValidConfirmPassword) {
      const newPassword = getValues('newPassword'); // Lấy giá trị mật khẩu mới
      setInitialData((prevData) => ({
        ...prevData,
        password: newPassword, // Lưu mật khẩu mới vào initialData
      }));
      setPasswordChanged(true); // Đánh dấu là đã đổi mật khẩu
      setOldPasswordCorrect(false); // Reset trạng thái mật khẩu cũ
      setIsEditing((prevState) => ({
        ...prevState,
        password: false, // Tắt form chỉnh sửa mật khẩu
      }));
    }
  };
  const renderFormItem = (label, fieldName, placeholder, isPassword = false) => (
    <AntForm.Item
      label={label}
      validateStatus={errors[fieldName] ? 'error' : ''}
      help={errors[fieldName]?.message}
    >
      {isEditing[fieldName] && (
        <>
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              isPassword ? (
                <Input.Password
                  {...field}
                  placeholder={placeholder}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              ) : (
                <Input {...field} placeholder={placeholder} />
              )
            )}
          />
          <Button
            type="primary"
            onClick={async () => {
              const isValid = await trigger(fieldName); // Chỉ trigger validate cho trường hiện tại
              if (isValid) {
                handleSave(fieldName);
              }
            }}
          >
            Lưu thay đổi
          </Button>
          <Button onClick={() => handleCancel(fieldName)}>Hủy</Button>
        </>
      )}
      {!isEditing[fieldName] && (
        <>
          <div className="text-black text-xl font-['Arial'] w-full">{initialData[fieldName]}</div>
          <Button type="link" onClick={() => setIsEditing((prevState) => ({ ...prevState, [fieldName]: true }))}>
            Chỉnh sửa
          </Button>
        </>
      )}
    </AntForm.Item>
  );

  return (
    <>
      <div className='w-full'>
        <div className='w-[950px] mx-auto my-0'>
          <Breadcrumb
            separator=">"
            className="flex items-center font-bold text-lg m-3"
          >
            <Breadcrumb.Item>
              <Link to="/" style={{ color: "#EA4444" }} className="">
                Trang chủ
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link style={{ color: "#EA4444" }} className="">
                Thông tin cá nhân
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <div className='w-full
       flex 
       justify-center'>
        <div className="w-[1250px] 
        h-[712px] 
        pl-[37px] 
        pr-14 
        py-[71px] 
        shadow 
        gap-[23px] 
        flex 
        justify-center
         items-center 
         col-span-2">
          <div className="
          w-full 
          h-full 
          flex 
          flex-col 
          items-end 
          pt-[15px] 
          rounded-[10px]">
            <div className="w-full h-[50px]">
              <div className="
              text-black 
              text-2xl 
              h-[50px] 
              flex 
              items-center 
              font-['Arial'] 
              ps-2 shadow">
                Ảnh Đại Diện
              </div>
            </div>
            <div className="
            w-full
            h-[315px]
            bg-white 
            shadow 
            flex 
            justify-center 
            items-center">
              <div className='flex flex-col'>
                <img
                  src="./img/avatar.svg"
                  alt=""
                  className="
                inline-block 
                h-[200px] 
                w-[200px] 
                rounded-full 
                ring-2 
                ring-lime-100"
                />
                <div className='mt-10'>
                  <div className="
                  w-full 
                  flex 
                  justify-center 
                  text-black 
                  text-xl 
                  font-bold 
                  font-['Arial']"
                  >
                    <div className="mb-1">
                      <div className="
                      file-input-wrapped 
                      flex 
                      justify-center 
                      items-center">
                        <div>
                          <input
                            type="file"
                            id="file-input"
                            name="ImageStyle"
                            className="file-input-class"
                            accept="image/*"
                            style={{ display: 'none' }}
                          /></div>
                        <label htmlFor="file-input"
                          className="
                        upload-button 
                        flex 
                        justify-center 
                        items-center 
                        px-2
                        rounded-[10px]
                        bg-[#FFFFFF] 
                        border-2 
                        border-[#FA4444]">
                          <img src={Avt} width={20} alt="" />
                          <p>Cập nhật ảnh đại diện</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin cá nhân */}
          <div className="
          w-[699px] 
          h-[570px] 
          mt-[30px] 
          relative 
          flex-col 
          flex shadow">
            <div className="w-[654px]">
              <div
                className="
                text-black 
                  text-2xl 
                  h-[50px] 
                  flex 
                  items-center 
                  w-full 
                  ms-2 
                  font-['Arial']
                  ">

                Thông tin cá nhân
              </div>
            </div>
            <AntForm
              layout="vertical"
              style={{
                width: '400px',
                margin: '0 auto'
              }}>
              {/* Họ và tên */}
              {renderFormItem('Họ và tên', 'name', 'Nhập họ và tên')}

              {/* Email */}
              {renderFormItem('Email', 'email', 'Nhập email')}

              {/* Mật khẩu */}

             
              <AntForm.Item
                label="Mật khẩu"
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}>
                {!isEditing.password ? (
                  <Button
                    type="link"
                    onClick={() => setIsEditing((prevState) => ({ ...prevState, password: true }))}>
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
                          )}
                        />
                        <Button type="primary" onClick={handleOldPasswordSubmit}>Xác nhận mật khẩu cũ</Button>
                        <Button onClick={() => handleCancel('password')}>Hủy</Button>
                      </>
                    ) : (
                      <Button type="link" onClick={() => setPasswordChanged(false)}>
                        Đổi lại mật khẩu
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <AntForm.Item label="Mật khẩu mới" validateStatus={errors.newPassword ? 'error' : ''} help={errors.newPassword?.message}>
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

                    <AntForm.Item label="Xác nhận mật khẩu mới" validateStatus={errors.confirmPassword ? 'error' : 'Đã đổi mật khẩu'}
                      help={errors.confirmPassword?.message}>
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

                    <Button type="primary" onClick={handleSavePassword}>Lưu thay đổi</Button>
                    <Button onClick={() => handleCancel('password')}>Hủy</Button>
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
      </div>
    </>
  );
};

export default Profile;
