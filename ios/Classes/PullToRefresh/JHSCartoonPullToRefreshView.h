//
//  JHSCartoonPullToRefreshView.h
//  JU
//
//  Created by lamo on 14/12/23.
//  Copyright (c) 2014年 ju.taobao.com. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "JHSPullToRefreshProtocols.h"

@class JHSMagicLampPullToRefreshView;

@interface JHSCartoonPullToRefreshView : UIView<JHSPullToRefreshViewObject> {
    UIImageView *_sellingPointsView;
    JHSMagicLampPullToRefreshView *_lampView;
    UIImageView *_cartoonView;

    CGFloat _value;
}

/**
 * `用户下拉`时，左侧卖点露出的`最大`比例，大于等于1.0表示完全露出
 */
@property(nonatomic, readonly) CGFloat value;

@end
