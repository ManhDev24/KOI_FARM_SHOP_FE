import { Col, Flex, Row } from 'antd'
import React from 'react'

const Categories = () => {
    return (
        < >
            <Flex justify='center'>
                <div className='w-[950px] h-[50px] bg-white text-[36px] text-[#FA4444] text-center border border-3 border-[#FA4444] mt-0 '>
                    <span>DANH MỤC CÁ KOI</span>
                </div>
            </Flex>
            <Flex justify='center'>
                <Row className='my-[80px] w-[950px] h-[500px] justify-around'>
                    <Col className='w-[240px] '>
                        <img src="/img/bengoi.png" alt="" className='h-[570px]' />
                    </Col>
                    <Col className='w-[240px]'>
                        <img src="/img/SHUSUI.png" alt="" className='h-[570px]' />
                    </Col>
                    <Col className=' ' >
                        <img src="/img/asagi.jpg" alt="" className='h-[570px]' />
                    </Col>
                </Row>
            </Flex>

        </>
    )
}

export default Categories
