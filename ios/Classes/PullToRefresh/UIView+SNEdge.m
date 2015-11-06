//
//  UIView+SNEdge.m
//  navigation
//
//  Created by lamo on 14-5-29.
//  Copyright (c) 2014年 jhs. All rights reserved.
//

#import "UIView+SNEdge.h"

#define returnOnEqual(_P_)   \
    do {                     \
        if (self._P_ == _P_) \
            return;          \
    } while (0)

#define selfCenterWithY(_Y_) (SNStructWith(self.center, y, _Y_))

#define selfCenterWithX(_X_) (SNStructWith(self.center, x, _X_))

/*
 * frame属性在transform不等于CGAffineTransformIdentity时，返回值未定义并且不应该被修改
 * 下面实现全部基于center和bounds属性
 */

@implementation UIView (SNEdge)

- (CGFloat)sn_top {
    return self.center.y - self.sn_height / 2.0;
}

- (void)setSn_top:(CGFloat)sn_top {
    returnOnEqual(sn_top);

    self.center = selfCenterWithY(sn_top + self.sn_height / 2.0);
}

- (CGFloat)sn_bottom {
    return self.center.y + self.sn_height / 2.0;
}

- (void)setSn_bottom:(CGFloat)sn_bottom {
    returnOnEqual(sn_bottom);

    self.center = selfCenterWithY(sn_bottom - self.sn_height / 2.0);
}

- (CGFloat)sn_left {
    return self.center.x - self.sn_width / 2.0;
}

- (void)setSn_left:(CGFloat)sn_left {
    returnOnEqual(sn_left);

    self.center = selfCenterWithX(sn_left + self.sn_width / 2.0);
}

- (CGFloat)sn_right {
    return self.center.x + self.sn_width / 2.0;
}

- (void)setSn_right:(CGFloat)sn_right {
    returnOnEqual(sn_right);

    self.center = selfCenterWithX(sn_right - self.sn_width / 2.0);
}

- (CGFloat)sn_width {
    return self.bounds.size.width;
}

- (void)setSn_width:(CGFloat)sn_width {
    returnOnEqual(sn_width);

    self.bounds = SNStructWith(self.bounds, size.width, sn_width);
}

- (CGFloat)sn_height {
    return self.bounds.size.height;
}

- (void)setSn_height:(CGFloat)sn_height {
    returnOnEqual(sn_height);

    self.bounds = SNStructWith(self.bounds, size.height, sn_height);
}

- (CGFloat)sn_centerX {
    return self.center.x;
}

- (void)setSn_centerX:(CGFloat)sn_centerX {
    returnOnEqual(sn_centerX);
    self.center = selfCenterWithX(sn_centerX);
}

- (CGFloat)sn_centerY {
    return self.center.y;
}

- (void)setSn_centerY:(CGFloat)sn_centerY {
    returnOnEqual(sn_centerY);
    self.center = selfCenterWithX(sn_centerY);
}


-(void)setSn_origin:(CGPoint)sn_origin{
    if (CGPointEqualToPoint(sn_origin, self.frame.origin)){
        return;
    }
    
    CGRect frame = self.frame;
    frame.origin = sn_origin;
    self.frame = frame;
}

-(CGPoint)sn_origin{
    return self.frame.origin;
}

-(void)setSn_size:(CGSize)sn_size{
    if (CGSizeEqualToSize(sn_size, self.frame.size)){
        return;
    }
    
    CGRect frame = self.frame;
    frame.size = sn_size;
    self.frame = frame;
}

-(CGSize)sn_size{
    return self.frame.size;
}

- (void)removeAllSubviews {
    while (self.subviews.count) {
        UIView* child = self.subviews.lastObject;
        [child removeFromSuperview];
    }
}

- (UIViewController*)viewController {
    for (UIView* next = self; next; next = next.superview) {
        if ([next.nextResponder isKindOfClass:[UIViewController class]]) {
            return (UIViewController*)next.nextResponder;
        }
    }
    return nil;
}

@end

#undef returnOnEqual
