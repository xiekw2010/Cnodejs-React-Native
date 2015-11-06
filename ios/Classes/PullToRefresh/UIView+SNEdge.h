//
//  UIView+SNEdge.h
//  navigation
//
//  Created by lamo on 14-5-29.
//  Copyright (c) 2014年 jhs. All rights reserved.
//

#import <UIKit/UIKit.h>

#define SNStructWith(_Origin_, _Path_, _Value_) \
    ({                                          \
        typeof(_Origin_) a = (_Origin_);        \
        a._Path_ = (_Value_);                   \
        a;                                      \
    })

@interface UIView (SNEdge)

@property(nonatomic, assign) CGFloat sn_top;
@property(nonatomic, assign) CGFloat sn_bottom;
@property(nonatomic, assign) CGFloat sn_left;
@property(nonatomic, assign) CGFloat sn_right;

@property(nonatomic, assign) CGFloat sn_width;
@property(nonatomic, assign) CGFloat sn_height;

@property(nonatomic, assign) CGFloat sn_centerX;
@property(nonatomic, assign) CGFloat sn_centerY;

@property(nonatomic, assign) CGPoint sn_origin;
@property(nonatomic, assign) CGSize sn_size;

- (void)removeAllSubviews;
- (UIViewController*)viewController;

@end
