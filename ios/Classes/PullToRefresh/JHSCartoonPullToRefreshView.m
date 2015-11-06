//
//  JHSCartoonPullToRefreshView.m
//  JU
//
//  Created by lamo on 14/12/23.
//  Copyright (c) 2014年 ju.taobao.com. All rights reserved.
//

#import "JHSCartoonPullToRefreshView.h"
#import "JHSMagicLampPullToRefreshView.h"

@implementation JHSCartoonPullToRefreshView
@dynamic ready;
@dynamic loading;
@dynamic minDraggingDistance;

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.clipsToBounds = YES;

        _sellingPointsView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"JHSKit.bundle/selling_points"]];
        _cartoonView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"JHSKit.bundle/katong_ju_0"]];
        _cartoonView.contentMode = UIViewContentModeCenter;
        _lampView = [[JHSMagicLampPullToRefreshView alloc] init];

        [self addSubview:_lampView];
        [self addSubview:_sellingPointsView];
        [self addSubview:_cartoonView];
    }

    return self;
}

- (id)forwardingTargetForSelector:(SEL)aSelector {
    return _lampView;
}

- (void)layoutWithPresenterState:(id<JHSPullToRefreshPresenter>)state {
    _lampView.frame = self.bounds;
    [_lampView layoutWithPresenterState:state];

    CGFloat offsetY = state.visibleHeight;

    CGFloat w = self.bounds.size.width;
    CGFloat centerX[2] = {
        w / 6.0, w / 6.0 * 5.0,
    };

    _sellingPointsView.center = CGPointMake(
        centerX[0], self.bounds.size.height - _sellingPointsView.bounds.size.height / 2.0);
    _cartoonView.center =
        CGPointMake(centerX[1], self.bounds.size.height + 138.0 -
                                    _cartoonView.bounds.size.height / 2.0 - offsetY * 1.6);

    if (!state.dragging) {
        return;
    }

    _value = MAX(state.visibleHeight / (CGRectGetHeight(_sellingPointsView.bounds)), _value);

    if (offsetY < 80.0) {
        _cartoonView.image = [UIImage imageNamed:@"JHSKit.bundle/katong_ju_0"];
    } else if (offsetY < 128.0) {
        _cartoonView.image = [UIImage imageNamed:@"JHSKit.bundle/katong_ju_1"];
    } else {
        _cartoonView.image = [UIImage imageNamed:@"JHSKit.bundle/katong_ju_2"];
    }
}

- (CGFloat)value {
    return _value;
}

@end
