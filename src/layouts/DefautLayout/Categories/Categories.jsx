import { Col, Flex, Row } from 'antd'
import React from 'react'

const Categories = () => {
    return (
        < >
            <Flex justify='center'>
                <div className='w-[950px] h-[50px] bg-white text-[36px] text-[#FA4444] text-center border border-3 border-[#FA4444] mt-0 '>
                    <span style={{ fontFamily: 'Merriweather, serif'}>DANH MỤC CÁ KOI</span>
                </div>
            </Flex>
            <Flex justify='center'>
                <Row className='my-[80px] w-[950px] h-[500px] justify-around'>
                    <Col className=''>
                        <img src="/img/bengoi.png" alt="" className='w-[240px] h-[580px]' />
                    </Col>
                    <Col className=''>
                        <img src="/img/SHUSUI.png" alt="" className='w-[240px] h-[580px]' />
                    </Col>
                    <Col className=' ' >
                        <img src="/img/asagi.jpg" alt="" className='w-[240px] h-[580px]' />
                    </Col>
                </Row>
            </Flex>

        </>
    )
}

export default Categories
